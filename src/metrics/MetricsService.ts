import { ElasticSearchService } from '../es';
import { MetricsConfig } from '../Types';
import { CollectorConfig, CollectorService, MetricItem } from './Types';

export class MetricsService {
  constructor(
    private elasticSearch: ElasticSearchService,
    private collectors: CollectorService<CollectorConfig, MetricItem>[]
  ) {}

  async start(metricsConfig: MetricsConfig): Promise<void> {
    if (!metricsConfig) {
      return;
    }
    for (const collectorConfig of metricsConfig.collectorConfigs || []) {
      for (const collector of this.collectors) {
        if (collector.supports(collectorConfig)) {
          try {
            const metricItems = await collector.fetch(collectorConfig);
            await this.processMetrics(metricItems);
          } catch (error) {
            console.warn(
              `There was a problem collecting metrics for: ${JSON.stringify(
                collectorConfig
              )}, error:${JSON.stringify(error)}, message:${error.message}`
            );
          }
        }
      }
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
