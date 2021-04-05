import { CollectorConfig, MetricItem } from '../../../metrics';

export type ExternalMetricItem = MetricItem;

export class ExternalCollectorConfig implements CollectorConfig {
  since: Date;
  until?: Date;
  teamName: string;
  type: string;
  srcType: string;
  srcPath: string;
  metricType: string;
  inlineData?: [];
  constructor({
    since,
    until = null,
    type,
    srcType,
    srcPath,
    metricType,
    teamName,
    inlineData = null,
  }) {
    this.since = since ? new Date(since) : null;
    this.until = until ? new Date(until) : null;
    this.type = type;
    this.srcType = srcType;
    this.srcPath = srcPath;
    this.metricType = metricType;
    this.teamName = teamName;
    this.inlineData = inlineData;
  }
}
