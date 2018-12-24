import * as elasticsearch from "elasticsearch";

export class ElasticSearchRepository {
  private client: any;
  private readonly host: string;

  constructor({ host }) {
    this.host = host;
    this.client = new elasticsearch.Client({
      host: this.host,
      log: "trace"
    });
  }

  async push({ indexName, type, id, payload }): Promise<any> {
    return this.client.index({
      index: indexName,
      type: type,
      id: id,
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
        type: type,
        body: {
          query: {
            match: {
              id: id
            }
          }
        }
      })
      .catch(ignored => {
        return { hits: { hits: [] } };
      });

    return response.hits.hits.length > 0;
  }
}
