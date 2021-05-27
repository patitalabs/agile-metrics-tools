import { MetricItem } from './metrics';

export interface TeamMetricsRequest {
  since?: Date;
  until?: Date;
  shouldUpdateEntries: boolean;
  config: any;
}

export interface ElasticSearchService {
  push(payload: MetricItem, shouldReplaceEntry?: boolean): Promise<any>;
  pushMetrics<T extends MetricItem>(
    metricItems: T[],
    shouldReplaceEntry?: boolean
  ): Promise<void>;
}
