import { CollectorModuleFactory, Utils } from '../../metrics';
import { SonarCollectorConfig, SonarMetricItem } from './collector/Types';
import { SonarService } from './Types';
import { SonarClientImpl } from './SonarClientImpl';
import { SonarRepositoryImpl } from './SonarRepositoryImpl';
import { SonarServiceImpl } from './SonarServiceImpl';
import { SonarCollectorsService } from './collector/SonarCollectorsService';

export class SonarqubeModuleFactory
  implements CollectorModuleFactory<SonarCollectorConfig, SonarMetricItem> {
  private static sonarService(): SonarService {
    Utils.checkEnvVar('SONAR_HOST');

    const sonarClient = new SonarClientImpl({
      host: `${process.env.SONAR_HOST}`,
    });
    const sonarRepository = new SonarRepositoryImpl(sonarClient);
    return new SonarServiceImpl(sonarRepository);
  }
  collectorInstance(): SonarCollectorsService {
    return new SonarCollectorsService(SonarqubeModuleFactory.sonarService());
  }

  collectorConfiguration(obj: any): SonarCollectorConfig {
    return new SonarCollectorConfig(obj);
  }
}
