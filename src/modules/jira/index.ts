import { JiraService } from "./Types";
import { JiraClientImpl } from "./JiraClientImpl";
import { JiraRepository } from "./JiraRepository";
import { JiraServiceImpl } from "./JiraServiceImpl";
import { JiraCollectorsService } from "./collector/JiraCollectorsService";
import { checkEnvVar } from "../../metrics/Utils";
import { CollectorModuleFactory } from "../../metrics/Types";
import { JiraCollectorConfig, JiraMetricItem } from "./collector/Types";

export { JiraCollectorsService } from "./collector/JiraCollectorsService";
export { JiraService } from "./Types";

export class JiraModuleFactory
  implements CollectorModuleFactory<JiraCollectorConfig, JiraMetricItem> {
  private static jiraService(): JiraService {
    checkEnvVar("JIRA_HOST", "JIRA_API_TOKEN");
    const jiraClient = new JiraClientImpl({
      host: `${process.env.JIRA_HOST}`,
      apiToken: `${process.env.JIRA_API_TOKEN}`
    });
    const jiraRepository = new JiraRepository(jiraClient);
    return new JiraServiceImpl(jiraRepository);
  }

  collectorInstance(): JiraCollectorsService {
    return new JiraCollectorsService(JiraModuleFactory.jiraService());
  }

  collectorConfiguration(obj: any): JiraCollectorConfig {
    return new JiraCollectorConfig(obj);
  }
}
