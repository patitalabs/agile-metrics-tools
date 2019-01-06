export class Sprint {
  id: number;
  name: string;
  isoStartDate: Date;
  isoEndDate: Date;
}

export class SprintTask {
  key: string;
  typeName: string;
  statusName: string;
  assignee: string;
  epic: string;
  sprint: Sprint;
  created: Date;
  projectName: string;
  teamName: string;
  createdBy: string;
  resolutionDate: Date;
  storyPoints: number;
  labels: string[];
  subtasks: SprintSubtask[];
  histories: { [type: string]: HistoryEntry[] };
  numberOfComments: number;
  numberOfBugs: number;
}

export class SprintSubtask {
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
  since: Date;
  workFlowMap?: { [name: string]: number };
  fields?: { [name: string]: string };
}

export interface IssueDetails {
  subtasks: SprintSubtask[];
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
  completedSprintsSince(teamId: number, referenceDate: Date): Promise<Sprint[]>;

  sprintData(jiraConfig: JiraConfig, sprint: Sprint): Promise<SprintTask[]>;
}

export interface JiraClient {
  getData(url: string): Promise<any>;
}

export interface JiraRepository {
  issueDetailsWithChangelog(
    jiraConfig: JiraConfig,
    issueId: string
  ): Promise<IssueDetails>;
  sprintData(jiraConfig: JiraConfig, sprint: Sprint): Promise<SprintTask[]>;

  completedSprintsSince(teamId: number, referenceDate: Date): Promise<Sprint[]>;
}
