import { CollectorModuleFactory } from "../../metrics";
import { ExternalCollectorConfig, ExternalMetricItem } from "./collector/Types";
import { ExternalCollectorService } from "./collector/ExternalCollectorService";
import { ExternalService } from "./Types";
import { ExternalRepository } from "./ExternalRepository";
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
    const externalRepository = new ExternalRepository();
    return new ExternalServiceImpl(externalRepository);
  }

  collectorConfiguration(obj: any): ExternalCollectorConfig {
    return new ExternalCollectorConfig(obj);
  }
}
