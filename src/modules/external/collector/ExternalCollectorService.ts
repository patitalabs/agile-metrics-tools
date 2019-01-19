import { CollectorService } from '../../../metrics';
import { ExternalCollectorConfig, ExternalMetricItem } from './Types';
import { ExternalMetricConverter } from './ExternalMetricConverter';
import { ExternalConfig, ExternalService } from '../Types';

export class ExternalCollectorService
  implements CollectorService<ExternalCollectorConfig, ExternalMetricItem> {
  constructor(private externalService: ExternalService) {}

  async fetch(
    externalCollectorConfig: ExternalCollectorConfig
  ): Promise<ExternalMetricItem[]> {
    if (!this.supports(externalCollectorConfig)) {
      return [];
    }

    const externalConfig: ExternalConfig = { ...externalCollectorConfig };

    const externalData = await this.externalService.fetchExternalInfo(
      externalConfig
    );
    return ExternalMetricConverter.toMetricItem(
      externalData,
      externalCollectorConfig
    );
  }

  supports(config: any): boolean {
    return config instanceof ExternalCollectorConfig;
  }
}
