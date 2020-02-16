import { ElasticSearchService } from '../es';
import { MetricsConfig } from '../Types';
import { CollectorConfig, CollectorService, MetricItem } from './Types';
import { Logger } from './Logger';

export class MetricsService {
  constructor(
    private readonly elasticSearch: ElasticSearchService,
    private readonly collectors: CollectorService<CollectorConfig, MetricItem>[]
  ) {}

  async start(metricsConfig: MetricsConfig): Promise<void> {
    if (!metricsConfig) {
      return;
    }
    for (const collectorConfig of metricsConfig.collectorConfigs || []) {
      for (const collector of this.collectors) {
        if (collector.supports(collectorConfig)) {
          await this.collectMetrics(collector, collectorConfig);
        }
      }
    }
  }

  private async collectMetrics(collector, collectorConfig) {
    try {
      const metricItems = await collector.fetch(collectorConfig);
      await this.processMetrics(metricItems);
      Logger.info(
        `Finished collecting metrics for: ${JSON.stringify(collectorConfig)}`
      );
    } catch (error) {
      Logger.warn(error);
      const errorMessage = `There was a problem collecting metrics for: ${JSON.stringify(
        collectorConfig
      )}, error:${JSON.stringify(error)}, message:${error.message}`;
      Logger.warn(`${errorMessage}`);
      throw errorMessage;
    }
  }

  private async processMetrics<T extends MetricItem>(
    metricItems: T[]
  ): Promise<void> {
    const pushPromises = metricItems.map(metricItem =>
      this.elasticSearch.push(metricItem)
    );
    await Promise.all(pushPromises);
  }
}
