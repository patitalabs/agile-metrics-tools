import { MetricItem } from '../../domain/metrics';
import { ElasticSearchRepository } from './ElasticSearchRepository';
import { Logger } from '../../domain/metrics/Logger';
import { ElasticSearchService } from '../../domain/Types';

export class ElasticSearchServiceImpl implements ElasticSearchService {
  constructor(
    private readonly elasticSearchRepository: ElasticSearchRepository,
    private readonly indexPrefix: string
  ) {}

  async pushMetrics<T extends MetricItem>(
    metricItems: T[],
    shouldReplaceEntry?: boolean
  ): Promise<void> {
    const pushPromises = metricItems.map((metricItem) =>
      this.push(metricItem, shouldReplaceEntry)
    );
    await Promise.all(pushPromises);
  }

  async push(metricItem: MetricItem, shouldReplaceEntry = false): Promise<any> {
    const type = metricItem.dataType;
    const indexName = `${this.indexPrefix}-${type.toLowerCase()}`;
    const id = metricItem.id;

    if (!shouldReplaceEntry) {
      const entryExists = await this.elasticSearchRepository.entryExists(
        indexName,
        type,
        id
      );

      if (entryExists) {
        Logger.info('Item already exists...' + JSON.stringify(metricItem));
        return Promise.resolve({});
      }
    }

    return this.elasticSearchRepository.push({
      indexName,
      type,
      id,
      payload: metricItem,
    });
  }
}
