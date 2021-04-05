import { Task } from '../Types';
import { JiraCollectorConfig, JiraMetricItem } from './Types';
import { SprintUtils, TaskStatistics, Utils } from '../../../metrics';

export class JiraMetricConverter {
  static toMetricItem(
    jiraCollectorConfig: JiraCollectorConfig,
    task: Task
  ): JiraMetricItem {
    const statistics: TaskStatistics = this.taskStatistics(
      jiraCollectorConfig,
      task
    );

    const leadTime = SprintUtils.leadTime({
      created: task.created,
      resolutionDate: task.resolutionDate,
    });
    const devTime = SprintUtils.devTime(
      statistics.movedToDev,
      task.resolutionDate
    );

    const rawEstimateHealth = this.rawEstimateHealth(
      jiraCollectorConfig,
      task.storyPoints,
      devTime
    );
    return {
      id: Utils.toHash(`${task.projectName}-${task.key}`),
      dataType: 'PTS',
      createdAt: task.resolutionDate,
      key: task.key,
      createdBy: task.createdBy,
      issueType: task.typeName,
      movedForward: statistics.moveForward,
      movedBackward: statistics.moveBackward,
      storyPoints: task.storyPoints,
      assignees: this.taskAssignees(task),
      tags: task.labels,
      created: task.created,
      finished: task.resolutionDate,
      leadTime,
      devTime,
      commentCount: task.numberOfComments,
      jiraProject: task.projectName,
      teamName: task.teamName,
      estimateHealth: Math.round(rawEstimateHealth),
      rawEstimateHealth,
      numberOfBugs: task.numberOfBugs,
    };
  }

  private static rawEstimateHealth(
    jiraCollectorConfig: JiraCollectorConfig,
    storyPoints: number,
    devTime
  ) {
    if (jiraCollectorConfig.isKanban()) {
      return 0;
    }
    const defaultEstimateConfig = this.defaultEstimateConfig();
    const estimateConfig =
      jiraCollectorConfig.estimateConfig || defaultEstimateConfig;

    return SprintUtils.estimateHealth({
      estimate: storyPoints,
      actualTime: devTime,
      maxTime: estimateConfig.maxTime || defaultEstimateConfig.maxTime,
      estimationValues:
        estimateConfig.estimationValues ||
        defaultEstimateConfig.estimationValues,
    });
  }

  private static taskStatistics(
    jiraCollectorConfig: JiraCollectorConfig,
    task: Task
  ): TaskStatistics {
    const taskStatusMap =
      jiraCollectorConfig.workFlowMap ||
      JiraMetricConverter.defaultWorkFlowMap();
    const movedBackwardDates = [];
    const movedForwardDates = [];

    const statusHistoryEntries = task.histories.status || [];

    for (const history of statusHistoryEntries) {
      for (const historyItem of history.items) {
        const taskWasMovedBackward =
          taskStatusMap[historyItem.fromString] >
          taskStatusMap[historyItem.toString];
        if (taskWasMovedBackward) {
          movedBackwardDates.push(new Date(history.created));
        } else {
          movedForwardDates.push(new Date(history.created));
        }
      }
    }

    return {
      moveBackward: movedBackwardDates.length,
      moveForward: movedForwardDates.length,
      movedToDev: SprintUtils.movedToDev(movedForwardDates),
    };
  }

  private static taskAssignees(task: Task): string[] {
    const assignees = new Set<string>();
    const assigneesHistoryEntries = task.histories.assignee || [];
    for (const history of assigneesHistoryEntries) {
      for (const historyItem of history.items) {
        if (historyItem.toString) {
          assignees.add(historyItem.toString);
        }
        if (historyItem.fromString) {
          assignees.add(historyItem.fromString);
        }
      }
    }

    if (task.assignee) {
      assignees.add(task.assignee);
    }
    return Array.from(assignees);
  }

  private static defaultWorkFlowMap() {
    return {
      Open: 1,
      'On Hold': 2,
      'In Progress': 3,
      'Code Review': 4,
      'Po Review': 5,
      Closed: 6,
      Done: 7,
    };
  }

  private static defaultEstimateConfig() {
    return {
      maxTime: 7,
      estimationValues: [1, 2, 3, 5, 8],
    };
  }
}
