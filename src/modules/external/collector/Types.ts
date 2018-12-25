import { CollectorConfig, MetricItem } from "../../../metrics";

export interface ExternalMetricItem extends MetricItem {}

export class ExternalCollectorConfig implements CollectorConfig {
  since: Date;
  type: string;
  srcType: string;
  srcPath: string;
  metricType: string;
  constructor({ since, type, srcType, srcPath, metricType }) {
    this.since = since;
    this.type = type;
    this.srcType = srcType;
    this.srcPath = srcPath;
    this.metricType = metricType;
  }
}
