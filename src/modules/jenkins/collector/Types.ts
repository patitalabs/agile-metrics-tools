import { CollectorConfig, MetricItem } from '../../../metrics';

export interface JenkinsMetricItem extends MetricItem {
  jenkinsUrl: string;
  buildName: string;
  result: string;
  durationInSeconds: number;
  causedBy: string;
  revision: string;
  revisionDescription: string;
  buildNumber: string;
  projectName: string;
}

export class JenkinsCollectorConfig implements CollectorConfig {
  orgName: string;
  projectName: string;
  since: Date;
  until?: Date;

  constructor({ orgName, projectName, since, until = null }) {
    this.orgName = orgName;
    this.projectName = projectName;
    this.since = new Date(since);
    this.until = until ? new Date(until) : null;
  }
}
