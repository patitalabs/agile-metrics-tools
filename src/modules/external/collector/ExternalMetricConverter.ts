import { ExternalCollectorConfig, ExternalMetricItem } from './Types';
import { ExternalData } from '../Types';
import { Utils } from '../../../metrics';

export class ExternalMetricConverter {
  static toMetricItem(
    externalData: ExternalData[],
    externalCollectorConfig: ExternalCollectorConfig
  ): ExternalMetricItem[] {
    return externalData.map((item) => {
      const dataType = `EXT-${externalCollectorConfig.metricType}`;
      return {
        id: this.createId(item, dataType),
        teamName: externalCollectorConfig.teamName,
        dataType,
        ...item,
      };
    });
  }

  private static createId(item: ExternalData, dataType: string) {
    return Utils.toHash(
      JSON.stringify({
        createdAt: item.createdAt,
        dataType,
        teamName: item.teamName,
      })
    );
  }
}
