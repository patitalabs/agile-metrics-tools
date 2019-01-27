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

  async sprintData(jiraConfig: JiraConfig, sprint: Sprint): Promise<Task[]> {
    const url = `/rest/agile/1.0/board/${jiraConfig.teamId}/sprint/${
      sprint.id
    }/issue`;

    const { issues: issuesResponse } = await this.jiraClient.getData(url);

    const taskPromises: Promise<Task>[] = issuesResponse
      .filter(issue => issue.fields.issuetype.name !== 'Sub-task')
      .map(async issue => {
        const issueDetails = await this.issueDetailsWithChangelog(
          jiraConfig,
          issue.key
        );
        return Converters.toTask(jiraConfig, issue, sprint, issueDetails);
      });
    return await Promise.all(taskPromises);
  }

  async completedSprints(
    teamId: number,
    since: Date,
    until?: Date
  ): Promise<Sprint[]> {
    let desiredStartAt = 0;

    const allSprints = [];

    let shouldContinue = false;
    do {
      const url = `/rest/agile/1.0/board/${teamId}/sprint?state=closed&startAt=${desiredStartAt}`;
      const {
        values,
        isLast,
        startAt,
        maxResults,
        total
      } = await this.jiraClient.getData(url);
      shouldContinue = !isLast || total > maxResults;
      desiredStartAt += startAt + maxResults;
      allSprints.push(...values);
    } while (shouldContinue);

    return allSprints
      .filter(sprintData => {
        const completedDate: Date = new Date(sprintData.completeDate);
        return Utils.isDateInRange({ createdAt: completedDate, since, until });
      })
      .map(sprintData => {
        return Converters.toSprint(sprintData);
      });
  }
}
