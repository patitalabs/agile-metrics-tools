import { MetricItem } from "../metrics/Types";

export interface ElasticSearchService {
  push(payload: MetricItem): Promise<any>;
}
