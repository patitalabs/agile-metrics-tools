import {
  HistoryEntry,
  JiraConfig,
  JiraService,
  Sprint,
  Subtask,
  Task
} from '../Types';
import { JiraCollectorsService } from './JiraCollectorsService';
import { JiraCollectorConfig } from './Types';

function testSubtasks(): Subtask[] {
  return [{ key: 'someKey-12', statusName: 'Done' }];
}

function testHistories(): { [type: string]: HistoryEntry[] } {
  const historyEntry: HistoryEntry = {
    category: 'string',
    created: new Date('2018-12-04'),
    items: [
      {
        field: 'status',
        fromString: 'Open',
        toString: 'Done'
      }
    ]
  };
  return {
    status: [historyEntry]
  };
}

function testTask(): Task {
  return {
    key: 'someKey-1',
    typeName: 'Story',
    statusName: 'Done',
    assignee: 'someone',
    epic: 'someEpic',
    sprint: testSprint(),
    created: new Date('2018-12-02'),
    projectName: 'someProject',
    teamName: 'someTeam',
    createdBy: 'someone',
    resolutionDate: new Date('2018-12-06'),
    storyPoints: 2,
    labels: ['label1', 'label2'],
    subtasks: testSubtasks(),
    histories: testHistories(),
    numberOfComments: 4,
    numberOfBugs: 1
  };
}

function testSprint(): Sprint {
  return {
    id: 45,
    name: 'sprint name',
    isoStartDate: new Date('2018-12-03'),
    isoEndDate: new Date('2018-12-11')
  };
}

describe('JiraCollectorsService', () => {
  const jiraService: JiraService = {
    completedSprintsSince: (
      teamId: number,
      referenceDate: Date
    ): Promise<Sprint[]> => Promise.resolve([testSprint()]),

    sprintData: (jiraConfig: JiraConfig, sprint: Sprint): Promise<Task[]> =>
      Promise.resolve([testTask()]),

    completedKanbanIssuesSince: (jiraConfig: JiraConfig): Promise<Task[]> =>
      Promise.resolve([testTask()])
  };

  const jiraCollectorsService: JiraCollectorsService = new JiraCollectorsService(
    jiraService
  );

  const config = ({ workFlowType }): JiraCollectorConfig =>
    new JiraCollectorConfig({
      teamId: 68,
      teamName: 'someTeamName',
      since: '2018-11-20',
      workFlowMap: null,
      workFlowType,
      fields: null,
      until: '2020-11-20'
    });

  it('should fetch jiraMetrics for sprint', async () => {
    const jiraCollectorConfig = config({ workFlowType: 'sprint' });

    const data = await jiraCollectorsService.fetch(jiraCollectorConfig);
    expect(data).toMatchSnapshot();
  });

  it('should fetch jiraMetrics for kanban', async () => {
    const jiraCollectorConfig = config({ workFlowType: 'kanban' });

    const data = await jiraCollectorsService.fetch(jiraCollectorConfig);
    expect(data).toMatchSnapshot();
  });
});
