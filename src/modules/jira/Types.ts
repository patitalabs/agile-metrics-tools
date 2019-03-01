export class Sprint {
  id: number;
  name: string;
  isoStartDate: Date;
  isoEndDate: Date;
}

export class Task {
  key: string;
  typeName: string;
  statusName: string;
  assignee: string;
  epic: string;
  sprint?: Sprint;
  created: Date;
  projectName: string;
  teamName: string;
  createdBy: string;
  resolutionDate: Date;
  storyPoints: number;
  labels: string[];
  subtasks: Subtask[];
  histories: { [type: string]: HistoryEntry[] };
  numberOfComments: number;
  numberOfBugs: number;
}

export class Subtask {
  key: string;
  statusName: string;
}

export class HistoryItem {
  field: string;
  fromString: string;
  toString: string;
}

export class HistoryEntry {
  category: string;
  created: Date;
  items: HistoryItem[];
}

export interface JiraConfig {
  teamId: number;
  teamName: string;
  since: Date;
  until?: Date;
  workFlowMap?: { [name: string]: number };
  workFlowType: 'sprint' | 'kanban';
  fields?: { [name: string]: string };
}

export interface IssueDetails {
  subtasks: Subtask[];
  histories: { [type: string]: HistoryEntry[] };
  labels: string[];
  created: Date;
  createdBy: string;
  resolutionDate: Date;
  projectName: string;
  teamName: string;
  numberOfComments: number;
  numberOfBugs: number;
}

export interface JiraService {
  completedSprintsSince(
    teamId: number,
    since: Date,
    until: Date
  ): Promise<Sprint[]>;

  sprintData(jiraConfig: JiraConfig, sprint: Sprint): Promise<Task[]>;

  completedKanbanIssuesSince(jiraConfig: JiraConfig): Promise<Task[]>;
}

export interface JiraClient {
  getData(url: string): Promise<any>;
}

export interface JiraRepository {
  issueDetailsWithChangelog(
    jiraConfig: JiraConfig,
    issueId: string
  ): Promise<IssueDetails>;
  sprintData(jiraConfig: JiraConfig, sprint: Sprint): Promise<Task[]>;

  completedSprints(
    teamId: number,
    since: Date,
    until?: Date
  ): Promise<Sprint[]>;

  completedKanbanIssuesSince(jiraConfig: JiraConfig): Promise<Task[]>;
}
