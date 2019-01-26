import { MetricItem } from '../metrics';
import { ElasticSearchService } from './Types';
import { ElasticSearchRepository } from './ElasticSearchRepository';

export class ElasticSearchServiceImpl implements ElasticSearchService {
  constructor(
    private elasticSearchRepository: ElasticSearchRepository,
    private indexPrefix: string,
    private shouldReplaceEntry: boolean
  ) {}

  async push(payload: MetricItem): Promise<any> {
    const type = payload.dataType;
    const indexName = `${this.indexPrefix}-${type.toLowerCase()}`;
    const id = payload.id;

    if (!this.shouldReplaceEntry) {
      const entryExists = await this.elasticSearchRepository.entryExists(
        indexName,
        type,
        id
      );

      if (entryExists) {
        console.info('Item already exists...' + JSON.stringify(payload));
        return;
      }
    }

    return this.elasticSearchRepository.push({
      indexName: indexName,
      type: type,
      id: id,
      payload
    });
  }
}
