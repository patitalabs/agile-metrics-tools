import * as issueDetailsExpanded from './test/issue-details-expanded-response.json';
import * as sprintFakeData from './test/sprint-data-response.json';
import * as boardIssuesFakeData from './test/board-issues-data-response.json';
import * as completedSprints from './test/completed-sprint-since-response.json';
import { JiraClient, JiraConfig, JiraRepository, Sprint } from './Types';
import { JiraRepositoryImpl } from './JiraRepositoryImpl';

describe('JiraRepositoryImpl', () => {
  const jiraClient: JiraClient = {
    getData: async (url): Promise<any> => {
      if (/\/*\/?expand=changelog/.test(url)) {
        return issueDetailsExpanded;
      } else if (/\/search\?jql=Sprint.*/.test(url)) {
        return sprintFakeData;
      } else if (/\/issue\?jql=.*/.test(url)) {
        return boardIssuesFakeData;
      } else if (
        /\/rest\/agile\/.*\/board\/.*\/sprint\?state=closed/.test(url)
      ) {
        return completedSprints;
      }
      return {};
    }
  };
  const jiraRepository: JiraRepository = new JiraRepositoryImpl(jiraClient);

  const jiraSprintConfig: JiraConfig = {
    teamId: 1,
    teamName: 'someTeamName',
    since: new Date('2018-12-03'),
    workFlowType: 'sprint'
  };

  it('should get sprintData', async () => {
    const teamId = 2;
    const sprint: Sprint = {
      id: teamId,
      isoEndDate: new Date('2018-12-14'),
      isoStartDate: new Date('2018-12-21'),
      name: 'some name'
    };

    const data = await jiraRepository.sprintData(jiraSprintConfig, sprint);
    expect(data).toMatchSnapshot();
  });

  it('should get kanbanData', async () => {
    const jiraKanbanConfig: JiraConfig = {
      teamId: 1,
      teamName: 'someTeamName',
      since: new Date('2018-12-13'),
      workFlowType: 'kanban'
    };

    const data = await jiraRepository.completedKanbanIssuesSince(
      jiraKanbanConfig
    );
    expect(data).toMatchSnapshot();
  });

  it('should get completedSprints', async () => {
    const teamId = 1;
    const since: Date = new Date('2018-12-03');

    const data = await jiraRepository.completedSprints(teamId, since);
    expect(data).toMatchSnapshot();
  });

  it('should get issueDetails', async () => {
    const issueId = 'issue-id';

    const data = await jiraRepository.issueDetailsWithChangelog(
      jiraSprintConfig,
      issueId
    );
    expect(data).toMatchSnapshot();
  });
});
