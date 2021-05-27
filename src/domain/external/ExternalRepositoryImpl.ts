import { ExternalConfig, ExternalData, ExternalRepository } from './Types';
import { Converters } from './Converters';
import { Utils } from '../metrics';

export class ExternalRepositoryImpl implements ExternalRepository {
  async csv(externalConfig: ExternalConfig): Promise<ExternalData[]> {
    if (!ExternalRepositoryImpl.isDate(externalConfig.since)) {
      externalConfig.since = new Date(externalConfig.since);
    }
    return Promise.resolve(
      this.relevantExternalData(externalConfig, externalConfig.inlineData)
    );
  }

  private static isDate(date: any): boolean {
    return date instanceof Date && !isNaN(date.valueOf());
  }

  private relevantExternalData(
    externalConfig: ExternalConfig,
    externalConfigurations: ExternalData[]
  ): ExternalData[] {
    return externalConfigurations
      .map((jsonObj) => Converters.toExternalData(jsonObj))
      .filter((item) =>
        Utils.isDateInRange({
          createdAt: item.createdAt,
          until: externalConfig.until,
          since: externalConfig.since,
        })
      );
  }
}
