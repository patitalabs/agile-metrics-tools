import { SonarMetricConverter } from "./SonarMetricConverter";
import { CollectorService } from "../../../metrics";
import { SonarCollectorConfig, SonarMetricItem } from "./Types";
import { SonarService } from "../Types";

export class SonarCollectorsService
  implements CollectorService<SonarCollectorConfig, SonarMetricItem> {
  constructor(private sonarService: SonarService) {}

  public async fetch(
    sonarCollectorConfig: SonarCollectorConfig
  ): Promise<SonarMetricItem[]> {
    if (!this.supports(sonarCollectorConfig)) {
      return [];
    }
    const projectMetrics = await this.sonarService.projectMetrics({
      projectName: sonarCollectorConfig.projectName,
      since: sonarCollectorConfig.since
    });

    return projectMetrics.map(metricItem =>
      SonarMetricConverter.toMetricItem(metricItem)
    );
  }

  supports(config: any): boolean {
    return config instanceof SonarCollectorConfig;
  }
}
