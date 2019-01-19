import { CollectorModuleFactory, Utils } from '../../metrics';
import { JenkinsCollectorConfig, JenkinsMetricItem } from './collector/Types';
import { JenkinsService } from './Types';
import { JenkinsClientImpl } from './JenkinsClientImpl';
import { JenkinsServiceImpl } from './JenkinsServiceImpl';
import { JenkinsCollectorsService } from './collector/JenkinsCollectorsService';
import { JenkinsRepositoryImpl } from './JenkinsRepositoryImpl';

export class JenkinsModuleFactory
  implements CollectorModuleFactory<JenkinsCollectorConfig, JenkinsMetricItem> {
  private static jenkinsService(): JenkinsService {
    Utils.checkEnvVar('JENKINS_HOST', 'JENKINS_USER', 'JENKINS_API_TOKEN');
    const jenkinsClient = new JenkinsClientImpl({
      host: `${process.env.JENKINS_HOST}`,
      apiToken: `${process.env.JENKINS_API_TOKEN}`,
      apiUser: `${process.env.JENKINS_USER}`
    });
    const jenkinsRepository = new JenkinsRepositoryImpl(jenkinsClient);
    return new JenkinsServiceImpl(jenkinsRepository);
  }

  collectorInstance(): JenkinsCollectorsService {
    return new JenkinsCollectorsService(JenkinsModuleFactory.jenkinsService());
  }

  collectorConfiguration(obj: any): JenkinsCollectorConfig {
    return new JenkinsCollectorConfig(obj);
  }
}
