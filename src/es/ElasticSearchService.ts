import { MetricItem } from '../metrics';
import { ElasticSearchService } from './Types';
import { ElasticSearchRepository } from './ElasticSearchRepository';

export class ElasticSearchServiceImpl implements ElasticSearchService {
  constructor(
    private elasticSearchRepository: ElasticSearchRepository,
    private indexPrefix: string,
    private shouldReplaceEntry: boolean
  ) {}

  async push(metricItem: MetricItem): Promise<any> {
    const type = metricItem.dataType;
    const indexName = `${this.indexPrefix}-${type.toLowerCase()}`;
    const id = metricItem.id;

    if (!this.shouldReplaceEntry) {
      const entryExists = await this.elasticSearchRepository.entryExists(
        indexName,
        type,
        id
      );

      if (entryExists) {
        console.info('Item already exists...' + JSON.stringify(metricItem));
        return;
      }
    }

    return this.elasticSearchRepository.push({
      indexName: indexName,
      type: type,
      id: id,
      payload: metricItem
    });
  }
}
