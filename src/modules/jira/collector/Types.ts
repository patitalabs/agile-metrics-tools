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
  since: Date;
  workFlowMap?: { [name: string]: number };
  fields?: { [name: string]: string };
  estimateConfig?: { maxTime: number; estimationValues: number[] };

  constructor({ teamId, since, workFlowMap, fields }) {
    this.teamId = teamId;
    this.since = new Date(since);
    this.workFlowMap = workFlowMap;
    this.fields = fields;
  }
}
