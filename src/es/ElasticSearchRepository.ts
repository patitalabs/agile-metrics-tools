import * as elasticsearch from 'elasticsearch';

export class ElasticSearchRepository {
  private readonly client: any;
  private readonly host: string;

  constructor({ host }) {
    this.host = host;
    this.client = new elasticsearch.Client({
      host: this.host,
      log: 'error'
    });
  }

  async push({ indexName, type, id, payload }): Promise<any> {
    return await this.client.index({
      index: indexName,
      type,
      id,
      body: {
        ...payload
      }
    });
  }

  async entryExists(
    indexName: string,
    type: string,
    id: string
  ): Promise<boolean> {
    const response = await this.client
      .search({
        index: indexName,
        type,
        body: {
          query: {
            match: {
              id
            }
          }
        }
      })
      .catch(ignored => ({ hits: { hits: [] } }));

    return response.hits.hits.length > 0;
  }
}
