import { MetricsService } from "./metrics/MetricsService";
import { AppContext } from "./Types";
import { ElasticSearch } from "./es";
import { AppContextFactory } from "./AppContextFactory";

export class AppFactory {
  static async appContextFrom(fileConfigPath: string): Promise<AppContext> {
    const config = await ConfigurationUtils.loadConfiguration(fileConfigPath);
    return await AppContextFactory.appContext(config);
  }

  static metricsService(appContext: AppContext): MetricsService {
    const elasticSearchService = ElasticSearch.justLogEsService(
      appContext.appConfig.indexPrefix
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
