import { JiraConfig, JiraService, Sprint, SprintTask } from "../Types";
import { JiraMetricConverter } from "./JiraMetricConverter";
import { CollectorService } from "../../../metrics/Types";
import { JiraCollectorConfig, JiraMetricItem } from "./Types";
import { flatMap } from "../../../metrics/Utils";

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
      jiraConfig.since
    );

    const sprintsPromises: Promise<JiraMetricItem[]>[] = sprints.map(sprint => {
      return this.sprintDetails(jiraConfig, sprint);
    });

    const results = await Promise.all(sprintsPromises);
    return flatMap(item => item, results);
  }

  private async sprintDetails(
    jiraCollectorConfig: JiraCollectorConfig,
    sprint: Sprint
  ): Promise<JiraMetricItem[]> {
    const jiraConfig: JiraConfig = { ...jiraCollectorConfig };
    const sprintItems = await this.jiraService.sprintData(jiraConfig, sprint);
    return sprintItems.map((sprintItem: SprintTask) => {
      return JiraMetricConverter.toMetricItem(jiraCollectorConfig, sprintItem);
    });
  }

  supports(config: any): boolean {
    return config instanceof JiraCollectorConfig;
  }
}
