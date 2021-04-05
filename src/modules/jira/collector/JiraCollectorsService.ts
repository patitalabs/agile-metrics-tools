import { JiraConfig, JiraService, Sprint, Task } from '../Types';
import { JiraMetricConverter } from './JiraMetricConverter';
import { CollectorService, Utils } from '../../../metrics';
import { JiraCollectorConfig, JiraMetricItem } from './Types';

export class JiraCollectorsService
  implements CollectorService<JiraCollectorConfig, JiraMetricItem> {
  constructor(private readonly jiraService: JiraService) {}

  public async fetch(
    jiraConfig: JiraCollectorConfig
  ): Promise<JiraMetricItem[]> {
    if (!this.supports(jiraConfig)) {
      return [];
    }

    const tasks: Task[] = await this.tasks(jiraConfig);
    return tasks.map((task) =>
      JiraMetricConverter.toMetricItem(jiraConfig, task)
    );
  }

  private async tasks(jiraConfig: JiraCollectorConfig) {
    let tasks = [];
    if (jiraConfig.isKanban()) {
      tasks = await this.tasksForKanban(jiraConfig);
    } else {
      tasks = await this.tasksForSprint(jiraConfig);
    }
    return tasks;
  }

  private async tasksForSprint(
    jiraConfig: JiraCollectorConfig
  ): Promise<Task[]> {
    const sprints: Sprint[] = await this.jiraService.completedSprintsSince(
      jiraConfig.teamId,
      jiraConfig.since,
      jiraConfig.until
    );

    const taskPromises: Promise<Task[]>[] = sprints.map((sprint) =>
      this.sprintDetails(jiraConfig, sprint)
    );

    return Utils.flatMap((item) => item, await Promise.all(taskPromises));
  }

  private async tasksForKanban(
    jiraCollectorConfig: JiraCollectorConfig
  ): Promise<Task[]> {
    const jiraConfig = JiraCollectorsService.toJiraConfig(jiraCollectorConfig);
    return this.jiraService.completedKanbanIssuesSince(jiraConfig);
  }

  private static toJiraConfig(
    jiraCollectorConfig: JiraCollectorConfig
  ): JiraConfig {
    return { ...jiraCollectorConfig };
  }

  private async sprintDetails(
    jiraCollectorConfig: JiraCollectorConfig,
    sprint: Sprint
  ): Promise<Task[]> {
    const jiraConfig = JiraCollectorsService.toJiraConfig(jiraCollectorConfig);
    return this.jiraService.sprintData(jiraConfig, sprint);
  }

  supports(config: any): boolean {
    return config instanceof JiraCollectorConfig;
  }
}
