import { MetricItem } from '../metrics';

export interface ElasticSearchService {
  push(payload: MetricItem): Promise<any>;
}
