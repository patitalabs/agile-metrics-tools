import { MetricItem } from '../metrics';

export interface ElasticSearchService {
  push(payload: MetricItem, shouldReplaceEntry?: boolean): Promise<any>;
}
