import { CollectorService } from '../../metrics';
import { ExternalCollectorConfig, ExternalMetricItem } from './Types';
import { ExternalMetricConverter } from './ExternalMetricConverter';
import { ExternalConfig, ExternalService } from '../Types';

export class ExternalCollectorService implements CollectorService {
  constructor(private readonly externalService: ExternalService) {}

  async fetch(
    externalCollectorConfig: ExternalCollectorConfig
  ): Promise<ExternalMetricItem[]> {
    const externalConfig: ExternalConfig = { ...externalCollectorConfig };

    const externalData = await this.externalService.fetch(externalConfig);
    return ExternalMetricConverter.toMetricItem(
      externalData,
      externalCollectorConfig
    );
  }
}
