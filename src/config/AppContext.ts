import { ExternalCollectorService, ExternalService } from '../domain/external';
import { ExternalRepositoryImpl } from '../domain/external/ExternalRepositoryImpl';
import { ExternalServiceImpl } from '../domain/external/ExternalServiceImpl';
import { ApiMetricsService } from '../api/ApiMetricsService';

import { ElasticSearchRepository } from '../infrastructure/es/ElasticSearchRepository';
import { Logger } from '../domain/metrics/Logger';
import { AppConfig } from './AppConfig';
import { ElasticSearchService } from '../domain/Types';
import { ElasticSearchServiceImpl } from '../infrastructure/es/ElasticSearchService';
import { MetricItem } from '../domain/metrics';

function esService(indexPrefix = 'myindex'): ElasticSearchService {
  const elasticSearchRepository = new ElasticSearchRepository({
    host: AppConfig.esHost(),
  });
  return new ElasticSearchServiceImpl(elasticSearchRepository, indexPrefix);
}

function justLogEsService(): ElasticSearchService {
  return new (class implements ElasticSearchService {
    async pushMetrics<T extends MetricItem>(
      metricItems: T[],
      shouldReplaceEntry?: boolean
    ): Promise<void> {
      const pushPromises = metricItems.map((metricItem) => {
        Logger.info(JSON.stringify(metricItem));
        return Promise.resolve({});
      });
      await Promise.all(pushPromises);
    }
  })();
}

function externalService(): ExternalService {
  const externalRepository = new ExternalRepositoryImpl();
  return new ExternalServiceImpl(externalRepository);
}

function collectorService(): ExternalCollectorService {
  return new ExternalCollectorService(externalService());
}

function apiMetricsServiceInstance(): ApiMetricsService {
  return new ApiMetricsService(collectorService(), esService());
}

export const appContext = Object.freeze({
  apiMetricsService: apiMetricsServiceInstance(),
});
