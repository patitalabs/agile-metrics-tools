import { SprintTask } from "../Types";
import { Utils } from "../Utils";
import { JiraCollectorConfig, JiraMetricItem } from "./Types";
import { toHash } from "../../../metrics/Utils";

export class JiraMetricConverter {
  static toMetricItem(
    jiraCollectorConfig: JiraCollectorConfig,
    sprintTask: SprintTask
  ): JiraMetricItem {
    const statistics: Statistics = this.taskStatistics(
      jiraCollectorConfig,
      sprintTask
    );

    const leadTime = this.leadTime(sprintTask);
    const devTime = this.devTime(statistics.movedToDev, sprintTask);

    const rawEstimateHealth = this.estimateHealth({
      estimate: sprintTask.storyPoints,
      actualTime: devTime,
      maxTime: 8,
      estimationValues: [1, 2, 3, 5, 8]
    });
    return {
      id: toHash(`${sprintTask.projectName}-${sprintTask.key}`),
      dataType: "PTS",
      createdAt: sprintTask.created,
      key: sprintTask.key,
      createdBy: sprintTask.createdBy,
      issueType: sprintTask.typeName,
      movedForward: statistics.moveForward,
      movedBackward: statistics.moveBackward,
      storyPoints: sprintTask.storyPoints,
      assignees: this.taskAssignees(sprintTask),
      tags: sprintTask.labels,
      finished: sprintTask.resolutionDate,
      leadTime: leadTime,
      devTime: devTime,
      commentCount: sprintTask.numberOfComments,
      jiraProject: sprintTask.projectName,
      teamName: sprintTask.teamName,
      estimateHealth: Math.round(rawEstimateHealth),
      rawEstimateHealth: rawEstimateHealth
    };
  }

  static estimateHealth({
    estimate,
    actualTime,
    maxTime,
    estimationValues
  }): number {
    if (!estimationValues) {
      estimationValues = [1, 2, 3, 5, 8];
    }
    return new HealthEstimate({
      maxTime,
      estimationValues,
      estimate,
      actualTime
    }).calculateHealthFactor();
  }

  private static taskStatistics(
    jiraCollectorConfig: JiraCollectorConfig,
    sprintTask: SprintTask
  ): Statistics {
    const taskStatusMap =
      jiraCollectorConfig.workFlowMap ||
      JiraMetricConverter.defaultWorkFlowMap();
    const movedBackwardDates = [];
    const movedForwardDates = [];

    let statusHistoryEntries = sprintTask.histories.status || [];

    for (let history of statusHistoryEntries) {
      for (let historyItem of history.items) {
        let taskWasMovedBackward =
          taskStatusMap[historyItem.fromString] >
          taskStatusMap[historyItem.toString];
        if (taskWasMovedBackward) {
          movedBackwardDates.push(new Date(history.created));
        } else {
          movedForwardDates.push(new Date(history.created));
        }
      }
    }

    const movedToDev = this.movedToDev(movedForwardDates);
    return {
      moveBackward: movedBackwardDates.length,
      moveForward: movedForwardDates.length,
      movedToDev: movedToDev
    };
  }

  private static taskAssignees(sprintTask: SprintTask): string[] {
    const assignees = new Set();
    let assigneesHistoryEntries = sprintTask.histories.assignee || [];
    for (let history of assigneesHistoryEntries) {
      for (let historyItem of history.items) {
        if (historyItem.toString) {
          assignees.add(historyItem.toString);
        }
        if (historyItem.fromString) {
          assignees.add(historyItem.fromString);
        }
      }
    }

    if (sprintTask.assignee) {
      assignees.add(sprintTask.assignee);
    }
    return Array.from(assignees);
  }

  private static defaultWorkFlowMap() {
    return {
      Open: 1,
      "On Hold": 2,
      "In Progress": 3,
      "Code Review": 4,
      "Po Review": 5,
      Closed: 6,
      Done: 7
    };
  }

  private static movedToDev(movedForwardDates: Date[]): Date {
    let movedToDev: Date = null;
    if (movedForwardDates.length > 0) {
      movedToDev = movedForwardDates.reduce((dateOne, dateTwo) => {
        return dateOne < dateTwo ? dateOne : dateTwo;
      });
    }
    return movedToDev;
  }

  private static devTime(movedToDev: Date, sprintTask: SprintTask): number {
    let devTime = 0;
    if (movedToDev) {
      let endLeadTime = new Date();
      if (sprintTask.resolutionDate) {
        endLeadTime = sprintTask.resolutionDate;
      }
      devTime = Utils.daysBetween(movedToDev, endLeadTime);
      if (devTime == 0) {
        devTime = 1;
      }
    }
    return devTime;
  }

  private static leadTime(sprintTask: SprintTask): number {
    let leadTime = 0.0;
    if (sprintTask.created) {
      let endLeadTime = new Date();
      if (sprintTask.resolutionDate) {
        endLeadTime = sprintTask.resolutionDate;
      }
      leadTime = Utils.daysBetween(sprintTask.created, endLeadTime);
      if (leadTime == 0.0) {
        leadTime = 1;
      }
    }
    return leadTime;
  }
}

interface Statistics {
  moveBackward: number;
  moveForward: number;
  movedToDev: Date;
}

class HealthEstimate {
  private readonly maxTime: number;
  private readonly estimationValues: number[];
  private readonly estimate: number;
  private readonly actualTime: number;

  constructor({ maxTime, estimationValues, estimate, actualTime }) {
    this.maxTime = maxTime;
    this.estimationValues = estimationValues;
    this.estimate = estimate;
    this.actualTime = actualTime;
  }

  private currentEstimateIndex() {
    return this.estimationValues.indexOf(this.estimate);
  }

  private estimateTime() {
    return this.estimate * this.timeEstimateRatio();
  }

  private timeEstimateRatio(): number {
    return (
      this.maxTime / this.estimationValues[this.estimationValues.length - 1]
    );
  }

  private lowerTimeBound(): number {
    if (this.currentEstimateIndex() == 0) {
      return 0;
    }
    const previousEstimateIndex = this.estimationValues.indexOf(
      this.estimate - 1
    );
    const previousEstimateRatio = this.estimationValues[
      previousEstimateIndex * this.timeEstimateRatio()
    ];
    return (
      this.estimateTime() - (this.estimateTime() - previousEstimateRatio) / 2
    );
  }

  private upperTimeBound(): number {
    if (this.currentEstimateIndex() == this.estimationValues.length - 1) {
      return this.maxTime;
    }
    const nextEstimateIndex = this.estimationValues.indexOf(this.estimate + 1);
    const nextEstimateRatio = this.estimationValues[
      nextEstimateIndex * this.timeEstimateRatio()
    ];
    return this.estimateTime() + (nextEstimateRatio - this.estimateTime()) / 2;
  }

  /**
   * @return a value of 0 indicates that you're good.  Greater than 0 means underestimating, less than 0 indicated overestimating.
   */
  public calculateHealthFactor(): number {
    let result = 0.0;
    const upperTimeBound = this.upperTimeBound();
    const lowerTimeBound = this.lowerTimeBound();
    const isUnderEstimated = upperTimeBound < this.actualTime;
    const isOverEstimated = lowerTimeBound > this.actualTime;

    if (isUnderEstimated) {
      result = this.actualTime - upperTimeBound;
    } else if (isOverEstimated) {
      let difference = lowerTimeBound - this.actualTime;
      result = -difference;
    }

    return result;
  }
}
