import {
  IssueDetails,
  JiraClient,
  JiraConfig,
  JiraRepository,
  Sprint,
  SprintTask
} from "./Types";
import { Converters } from "./Converters";

export class JiraRepositoryImpl implements JiraRepository {
  constructor(private jiraClient: JiraClient) {}

  async issueDetailsWithChangelog(
    jiraConfig: JiraConfig,
    issueId: string
  ): Promise<IssueDetails> {
    const url = `/rest/api/2/issue/${issueId}?expand=changelog`;
    const issueResponse = await this.jiraClient.getData(url);
    return Converters.toIssueDetails(jiraConfig, issueResponse);
  }

  async sprintData(
    jiraConfig: JiraConfig,
    sprint: Sprint
  ): Promise<SprintTask[]> {
    const url = `/rest/agile/1.0/board/${jiraConfig.teamId}/sprint/${
      sprint.id
    }/issue`;

    const { issues: issuesResponse } = await this.jiraClient.getData(url);

    const sprintTaskPromises: Promise<SprintTask>[] = issuesResponse
      .filter(issue => issue.fields.issuetype.name !== "Sub-task")
      .map(async issue => {
        const issueDetails = await this.issueDetailsWithChangelog(
          jiraConfig,
          issue.key
        );
        return Converters.toSprintTask(jiraConfig, issue, sprint, issueDetails);
      });
    return await Promise.all(sprintTaskPromises);
  }

  async completedSprintsSince(
    teamId: number,
    referenceDate: Date
  ): Promise<Sprint[]> {
    const url = `/rest/agile/1.0/board/${teamId}/sprint?state=closed`;
    //TODO pagination
    const { values } = await this.jiraClient.getData(url);
    return values
      .filter(sprintData => {
        const completedDate: Date = new Date(sprintData.completeDate);
        return completedDate >= referenceDate;
      })
      .map(sprintData => {
        return Converters.toSprint(sprintData);
      });
  }
}
