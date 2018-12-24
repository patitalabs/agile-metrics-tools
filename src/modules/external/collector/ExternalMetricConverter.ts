import { ExternalCollectorConfig, ExternalMetricItem } from "./Types";
import { ExternalData } from "../Types";
import { toHash } from "../../../metrics/Utils";

export class ExternalMetricConverter {
  static toMetricItem(
    externalData: ExternalData[],
    externalCollectorConfig: ExternalCollectorConfig
  ): ExternalMetricItem[] {
    return externalData.map(item => {
      return {
        id: toHash(JSON.stringify(item)),
        dataType: `EXT-${externalCollectorConfig.metricType}`,
        ...item
      };
    });
  }
}
