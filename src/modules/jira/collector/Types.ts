import { CollectorConfig, MetricItem } from '../../../metrics';

export interface JiraMetricItem extends MetricItem {
  key: string;
  createdBy: string;
  issueType: string;
  movedForward: number;
  movedBackward: number;
  storyPoints: number;
  assignees: string[];
  tags: string[];
  created: Date;
  finished: Date;
  leadTime: number;
  devTime: number;
  commentCount: number;
  jiraProject: string;
  teamName: string;
  estimateHealth: number;
  rawEstimateHealth: number;
  numberOfBugs: number;
}

export class JiraCollectorConfig implements CollectorConfig {
  teamId: number;
  teamName: string;
  workFlowType: 'sprint' | 'kanban';
  since: Date;
  until?: Date;
  workFlowMap?: { [name: string]: number };
  fields?: { [name: string]: string };
  estimateConfig?: { maxTime: number; estimationValues: number[] };

  constructor({
    teamId,
    since,
    until = null,
    workFlowMap,
    fields,
    teamName,
    workFlowType
  }) {
    this.teamId = teamId;
    this.since = new Date(since);
    this.until = until ? new Date(until) : null;
    this.workFlowMap = workFlowMap;
    this.fields = fields;
    this.teamName = teamName;
    this.workFlowType = workFlowType ? workFlowType : 'sprint';
  }

  isKanban() {
    return this.workFlowType === 'kanban';
  }

  isSprint() {
    return this.workFlowType === 'sprint';
  }
}
