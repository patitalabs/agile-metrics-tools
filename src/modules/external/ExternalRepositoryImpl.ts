import { ExternalConfig, ExternalData, ExternalRepository } from "./Types";
import { Converters } from "./Converters";
import { CsvReader } from "./CsvReader";

export class ExternalRepositoryImpl implements ExternalRepository {
  async csv(externalConfig: ExternalConfig): Promise<ExternalData[]> {
    if (!ExternalRepositoryImpl.isDate(externalConfig.since)) {
      externalConfig.since = new Date(externalConfig.since);
    }

    if (externalConfig.srcType === "file") {
      const externalConfigurations = await CsvReader.readFromCsv(
        externalConfig
      );
      return this.relevantExternalData(externalConfig, externalConfigurations);
    }
    return [];
  }

  private static isDate(date: any) {
    return date instanceof Date && !isNaN(date.valueOf());
  }

  private relevantExternalData(
    externalConfig: ExternalConfig,
    externalConfigurations: ExternalData[]
  ): ExternalData[] {
    return externalConfigurations
      .map(jsonObj => {
        return Converters.toExternalData(jsonObj);
      })
      .filter(item => {
        return item.createdAt >= externalConfig.since;
      });
  }
}