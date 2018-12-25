import { ExternalCollectorConfig, ExternalMetricItem } from "./Types";
import { ExternalData } from "../Types";
import { Utils } from "../../../metrics";

export class ExternalMetricConverter {
  static toMetricItem(
    externalData: ExternalData[],
    externalCollectorConfig: ExternalCollectorConfig
  ): ExternalMetricItem[] {
    return externalData.map(item => {
      return {
        id: Utils.toHash(JSON.stringify(item)),
        dataType: `EXT-${externalCollectorConfig.metricType}`,
        ...item
      };
    });
  }
}
