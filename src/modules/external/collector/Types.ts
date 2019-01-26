import { CollectorConfig, MetricItem } from '../../../metrics';

export interface ExternalMetricItem extends MetricItem {}

export class ExternalCollectorConfig implements CollectorConfig {
  since: Date;
  until?: Date;
  type: string;
  srcType: string;
  srcPath: string;
  metricType: string;
  constructor({ since, until = null, type, srcType, srcPath, metricType }) {
    this.since = since;
    this.until = until ? new Date(until) : null;
    this.type = type;
    this.srcType = srcType;
    this.srcPath = srcPath;
    this.metricType = metricType;
  }
}
