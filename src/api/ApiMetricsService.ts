import { ElasticSearchService, TeamMetricsRequest } from '../domain/Types';
import { Logger } from '../domain/metrics/Logger';
import { MetricItem } from '../domain/metrics';
import { ExternalCollectorService } from '../domain/external';

export class ApiMetricsService {
  constructor(
    private readonly collectorService: ExternalCollectorService,
    private readonly metricsService: ElasticSearchService
  ) {}

  public async metricsForRequest(
    teamMetricsRequest: TeamMetricsRequest
  ): Promise<void> {
    try {
      Logger.info(`teamMetricsRequest: ${JSON.stringify(teamMetricsRequest)}`);
      const configurationDescriptors =
        ApiMetricsService.createConfigurationDescriptorsForRequest(
          teamMetricsRequest
        );
      Logger.info(
        `created configurations: ${JSON.stringify(configurationDescriptors)}`
      );
      for (const configurationDescriptor of configurationDescriptors) {
        const metricItems = await this.collectorService.fetch(
          configurationDescriptor.config
        );
        await this.pushMetrics(
          metricItems,
          configurationDescriptor.shouldUpdateEntries
        );
      }
      Logger.info('Done!');
    } catch (error) {
      Logger.error(error);
    }
  }

  public async pushMetrics(
    metricItems: MetricItem[],
    shouldReplaceEntry?: boolean
  ): Promise<void> {
    await this.metricsService.pushMetrics(metricItems, shouldReplaceEntry);
  }

  static createConfigurationDescriptorsForRequest(
    teamMetricsRequest: TeamMetricsRequest
  ): any[] {
    if (teamMetricsRequest.config) {
      return [{ ...teamMetricsRequest }];
    }

    throw Error(
      `Unable to create configuration for request ${JSON.stringify(
        teamMetricsRequest
      )}`
    );
  }
}
