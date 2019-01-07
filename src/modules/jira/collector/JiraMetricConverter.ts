import { SprintTask } from "../Types";
import { JiraCollectorConfig, JiraMetricItem } from "./Types";
import { SprintUtils, TaskStatistics, Utils } from "../../../metrics";

export class JiraMetricConverter {
  static toMetricItem(
    jiraCollectorConfig: JiraCollectorConfig,
    sprintTask: SprintTask
  ): JiraMetricItem {
    const statistics: TaskStatistics = this.taskStatistics(
      jiraCollectorConfig,
      sprintTask
    );

    const leadTime = SprintUtils.leadTime({
      created: sprintTask.created,
      resolutionDate: sprintTask.resolutionDate
    });
    const devTime = SprintUtils.devTime(
      statistics.movedToDev,
      sprintTask.resolutionDate
    );

    const rawEstimateHealth = this.rawEstimateHealth(
      jiraCollectorConfig,
      sprintTask.storyPoints,
      devTime
    );
    return {
      id: Utils.toHash(`${sprintTask.projectName}-${sprintTask.key}`),
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
      rawEstimateHealth: rawEstimateHealth,
      numberOfBugs: sprintTask.numberOfBugs
    };
  }

  private static rawEstimateHealth(
    jiraCollectorConfig: JiraCollectorConfig,
    storyPoints: number,
    devTime
  ) {
    const defaultEstimateConfig = this.defaultEstimateConfig();
    const estimateConfig =
      jiraCollectorConfig.estimateConfig || defaultEstimateConfig;

    return SprintUtils.estimateHealth({
      estimate: storyPoints,
      actualTime: devTime,
      maxTime: estimateConfig.maxTime || defaultEstimateConfig.maxTime,
      estimationValues:
        estimateConfig.estimationValues ||
        defaultEstimateConfig.estimationValues
    });
  }

  private static taskStatistics(
    jiraCollectorConfig: JiraCollectorConfig,
    sprintTask: SprintTask
  ): TaskStatistics {
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

    const movedToDev = SprintUtils.movedToDev(movedForwardDates);
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

  private static defaultEstimateConfig() {
    return {
      maxTime: 8,
      estimationValues: [1, 2, 3, 5, 8]
    };
  }
}
