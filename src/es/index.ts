import { ElasticSearchService } from "./Types";
import { ElasticSearchServiceImpl } from "./ElasticSearchService";
import { ElasticSearchRepository } from "./ElasticSearchRepository";
import { Utils } from "../metrics";

export { ElasticSearchServiceImpl } from "./ElasticSearchService";
export { ElasticSearchService } from "./Types";

export class ElasticSearch {
  static esService(indexPrefix: string): ElasticSearchService {
    Utils.checkEnvVar("ES_HOST");
    const elasticSearchRepository = new ElasticSearchRepository({
      host: `${process.env.ES_HOST}`
    });
    return new ElasticSearchServiceImpl(elasticSearchRepository, indexPrefix);
  }

  static justLogEsService(indexPrefix: string): ElasticSearchService {
    return new class implements ElasticSearchService {
      async push(payload): Promise<any> {
        console.log(JSON.stringify(payload));
      }
    }();
  }
}
