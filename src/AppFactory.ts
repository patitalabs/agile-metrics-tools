import { MetricsService } from './metrics';
import { AppContext } from './Types';
import { ElasticSearch } from './es';
import { AppContextFactory } from './AppContextFactory';

export class AppFactory {
  static async appContextFrom(fileConfigPath: string): Promise<AppContext> {
    const config = await ConfigurationUtils.loadConfiguration(fileConfigPath);
    return AppContextFactory.appContext(config);
  }

  static metricsService(
    appContext: AppContext,
    shouldReplaceEntry = false
  ): MetricsService {
    const elasticSearchService = ElasticSearch.esService(
      appContext.appConfig.indexPrefix,
      shouldReplaceEntry
    );
    return new MetricsService(
      elasticSearchService,
      appContext.collectorsServices
    );
  }
}

class ConfigurationUtils {
  static async loadConfiguration(fileConfigPath: string) {
    const configContent = await import(fileConfigPath);
    return { ...configContent };
  }
}
