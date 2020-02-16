import {
  IssueDetails,
  JiraClient,
  JiraConfig,
  JiraRepository,
  Sprint,
  Task
} from './Types';
import { Converters } from './Converters';
import { Utils } from '../../metrics';
import { Logger } from '../../metrics/Logger';

export class JiraRepositoryImpl implements JiraRepository {
  constructor(private readonly jiraClient: JiraClient) {}

  async issueDetailsWithChangelog(
    jiraConfig: JiraConfig,
    issueId: string
  ): Promise<IssueDetails> {
    const url = `/rest/api/2/issue/${issueId}?expand=changelog`;
    const issueResponse = await this.jiraClient.getData(url);
    return Converters.toIssueDetails(jiraConfig, issueResponse);
  }

  async sprintData(jiraConfig: JiraConfig, sprint: Sprint): Promise<Task[]> {
    const url = `/rest/api/2/search?jql=Sprint=${sprint.id} AND NOT issuetype=Sub-task`;

    const { issues: issuesResponse } = await this.jiraClient.getData(url);

    const taskPromises: Promise<Task>[] = issuesResponse
      .filter(issue => issue.fields.issuetype.name !== 'Sub-task')
      .map(async issue => this.issueDetails(jiraConfig, issue, sprint))
      .filter(issue => Boolean(issue));
    return Promise.all(taskPromises);
  }

  async completedSprints(
    teamId: number,
    since: Date,
    until?: Date
  ): Promise<Sprint[]> {
    const url = `/rest/agile/1.0/board/${teamId}/sprint?state=closed`;
    const sprintDataResponse: any[] = await this.paginate(url, 'values');

    return sprintDataResponse
      .filter(sprintData => {
        const completedDate: Date = new Date(sprintData.completeDate);
        return Utils.isDateInRange({ createdAt: completedDate, since, until });
      })
      .map(sprintData => Converters.toSprint(sprintData));
  }

  async completedKanbanIssuesSince(jiraConfig: JiraConfig): Promise<Task[]> {
    const { since, until, teamId } = jiraConfig;

    const untilConstraint = until
      ? ` AND resolved <= "${Utils.formatDate(until)}" `
      : ``;
    const url = `/rest/agile/1.0/board/${teamId}/issue?jql=issuetype!=Sub-task AND resolved >= "${Utils.formatDate(
      since
    )}"${untilConstraint}`;
    const kanbanDataResponse: any[] = await this.paginate(url, 'issues');

    const taskPromises: Promise<Task>[] = kanbanDataResponse
      .map(issue => this.issueDetails(jiraConfig, issue, null))
      .filter(issue => Boolean(issue));

    return Promise.all(taskPromises);
  }

  private async issueDetails(
    jiraConfig: JiraConfig,
    issue,
    sprint: Sprint
  ): Promise<Task> {
    try {
      const issueDetailsWithChangelogResponse = await this.issueDetailsWithChangelog(
        jiraConfig,
        issue.key
      );
      return Converters.toTask(
        jiraConfig,
        issue,
        sprint,
        issueDetailsWithChangelogResponse
      );
    } catch (error) {
      Logger.error(`Skipping issue: ${issue.key}, error:${error.message}`);
    }
    return null;
  }

  private async paginate(
    targetUrl: string,
    responseTargetKey: string
  ): Promise<any[]> {
    let desiredStartAt = 0;
    const responseValues = [];
    let shouldContinue = false;
    do {
      const url = `${targetUrl}&startAt=${desiredStartAt}`;
      const responseData = await this.jiraClient.getData(url);
      const { startAt, maxResults, total } = responseData;

      let isLast = responseData.isLast;
      if (!isLast && isLast !== false) {
        isLast = true;
      }

      const values = responseData[responseTargetKey];
      shouldContinue = !isLast || total > maxResults;
      desiredStartAt += startAt + maxResults;
      responseValues.push(...values);
    } while (shouldContinue);

    return responseValues;
  }
}
