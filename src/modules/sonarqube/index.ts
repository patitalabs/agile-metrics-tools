import { SonarService } from "./Types";
import { SonarClientImpl } from "./SonarClientImpl";
import { SonarRepository } from "./SonarRepository";
import { SonarServiceImpl } from "./SonarServiceImpl";
import { SonarCollectorsService } from "./collector/SonarCollectorsService";
import { checkEnvVar } from "../../metrics/Utils";
import { CollectorModuleFactory } from "../../metrics/Types";
import { SonarCollectorConfig, SonarMetricItem } from "./collector/Types";

export { SonarCollectorsService } from "./collector/SonarCollectorsService";
export { SonarService } from "./Types";

export class SonarqubeModuleFactory
  implements CollectorModuleFactory<SonarCollectorConfig, SonarMetricItem> {
  private static sonarService(): SonarService {
    checkEnvVar("SONAR_HOST");

    const sonarClient = new SonarClientImpl({
      host: `${process.env.SONAR_HOST}`
    });
    const sonarRepository = new SonarRepository(sonarClient);
    return new SonarServiceImpl(sonarRepository);
  }
  collectorInstance(): SonarCollectorsService {
    return new SonarCollectorsService(SonarqubeModuleFactory.sonarService());
  }

  collectorConfiguration(obj: any): SonarCollectorConfig {
    return new SonarCollectorConfig(obj);
  }
}
