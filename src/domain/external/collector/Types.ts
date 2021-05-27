export class ExternalCollectorConfig {
  since: Date;
  until?: Date;
  type: string;
  srcType: string;
  metricType: string;
  inlineData: [];
  constructor({
    since,
    until = null,
    type,
    srcType,
    metricType,
    inlineData = null,
  }) {
    this.since = since ? new Date(since) : null;
    this.until = until ? new Date(until) : null;
    this.type = type;
    this.srcType = srcType;
    this.metricType = metricType;
    this.inlineData = inlineData;
  }
}
