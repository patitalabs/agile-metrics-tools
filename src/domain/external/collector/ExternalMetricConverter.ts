import { ExternalCollectorConfig } from './Types';
import { ExternalData } from '../Types';
import { MetricItem, Utils } from '../../metrics';

export class ExternalMetricConverter {
  static toMetricItem(
    externalData: ExternalData[],
    externalCollectorConfig: ExternalCollectorConfig
  ): MetricItem[] {
    return externalData.map((item) => {
      const dataType = `EXT-${externalCollectorConfig.metricType}`;
      return {
        id: this.createId(item, dataType),
        teamName: item.teamName,
        dataType,
        ...item,
      };
    });
  }

  private static createId(item: ExternalData, dataType: string): string {
    return Utils.toHash(
      JSON.stringify({
        createdAt: item.createdAt,
        dataType,
        teamName: item.teamName,
      })
    );
  }
}
