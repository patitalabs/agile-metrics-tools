import { JiraConfig, JiraService, Sprint, Task } from '../Types';
import { JiraMetricConverter } from './JiraMetricConverter';
import { CollectorService, Utils } from '../../../metrics';
import { JiraCollectorConfig, JiraMetricItem } from './Types';

export class JiraCollectorsService
  implements CollectorService<JiraCollectorConfig, JiraMetricItem> {
  constructor(private jiraService: JiraService) {}

  public async fetch(
    jiraConfig: JiraCollectorConfig
  ): Promise<JiraMetricItem[]> {
    if (!this.supports(jiraConfig)) {
      return [];
    }

    const sprints = await this.jiraService.completedSprintsSince(
      jiraConfig.teamId,
      jiraConfig.since,
      jiraConfig.until
    );

    const sprintsPromises: Promise<JiraMetricItem[]>[] = sprints.map(sprint => {
      return this.sprintDetails(jiraConfig, sprint);
    });

    const results = await Promise.all(sprintsPromises);
    return Utils.flatMap(item => item, results);
  }

  private async sprintDetails(
    jiraCollectorConfig: JiraCollectorConfig,
    sprint: Sprint
  ): Promise<JiraMetricItem[]> {
    const jiraConfig: JiraConfig = { ...jiraCollectorConfig };
    const sprintItems = await this.jiraService.sprintData(jiraConfig, sprint);
    return sprintItems.map((task: Task) => {
      return JiraMetricConverter.toMetricItem(jiraCollectorConfig, task);
    });
  }

  supports(config: any): boolean {
    return config instanceof JiraCollectorConfig;
  }
}
