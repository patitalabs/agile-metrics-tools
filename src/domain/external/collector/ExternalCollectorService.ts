import { CollectorService, MetricItem } from '../../metrics';
import { ExternalCollectorConfig } from './Types';
import { ExternalMetricConverter } from './ExternalMetricConverter';
import { ExternalConfig, ExternalService } from '../Types';

export class ExternalCollectorService implements CollectorService {
  constructor(private readonly externalService: ExternalService) {}

  async fetch(
    externalCollectorConfig: ExternalCollectorConfig
  ): Promise<MetricItem[]> {
    const externalConfig: ExternalConfig = {
      since: externalCollectorConfig.since,
      until: externalCollectorConfig.until,
      type: externalCollectorConfig.type,
      srcType: externalCollectorConfig.srcType,
      inlineData: externalCollectorConfig.inlineData,
    };

    const externalData = await this.externalService.fetch(externalConfig);
    return ExternalMetricConverter.toMetricItem(
      externalData,
      externalCollectorConfig
    );
  }
}
