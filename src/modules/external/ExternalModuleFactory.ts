import { CollectorModuleFactory } from "../../metrics";
import { ExternalCollectorConfig, ExternalMetricItem } from "./collector/Types";
import { ExternalCollectorService } from "./collector/ExternalCollectorService";
import { ExternalService } from "./Types";
import { ExternalRepositoryImpl } from "./ExternalRepositoryImpl";
import { ExternalServiceImpl } from "./ExternalServiceImpl";

export class ExternalModuleFactory
  implements
    CollectorModuleFactory<ExternalCollectorConfig, ExternalMetricItem> {
  collectorInstance(): ExternalCollectorService {
    return new ExternalCollectorService(
      ExternalModuleFactory.externalService()
    );
  }

  private static externalService(): ExternalService {
    const externalRepository = new ExternalRepositoryImpl();
    return new ExternalServiceImpl(externalRepository);
  }

  collectorConfiguration(obj: any): ExternalCollectorConfig {
    return new ExternalCollectorConfig(obj);
  }
}
