import { CollectorConfig, MetricItem } from '../../../metrics';

export interface GithubMetricItem extends MetricItem {
  sha: string;
  linesAdded: number;
  linesRemoved: number;
  author: string;
  repositoryName: string;
}

export class GithubCollectorConfig implements CollectorConfig {
  repositoryName: string;
  orgName: string;
  since: string;

  constructor({ repositoryName, orgName, since }) {
    this.repositoryName = repositoryName;
    this.orgName = orgName;
    this.since = since;
  }
}
