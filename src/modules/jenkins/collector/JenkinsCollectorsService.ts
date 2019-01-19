import { JenkinsMetricConverter } from './JenkinsMetricConverter';
import { CollectorService } from '../../../metrics';
import { JenkinsCollectorConfig, JenkinsMetricItem } from './Types';
import { JenkinsService } from '../Types';

export class JenkinsCollectorsService
  implements CollectorService<JenkinsCollectorConfig, JenkinsMetricItem> {
  constructor(private jenkinsService: JenkinsService) {}

  public async fetch(
    jenkinsConfig: JenkinsCollectorConfig
  ): Promise<JenkinsMetricItem[]> {
    if (!this.supports(jenkinsConfig)) {
      return [];
    }
    const jenkinsJob = await this.jenkinsService.findData(
      jenkinsConfig.orgName,
      jenkinsConfig.projectName,
      jenkinsConfig.since
    );

    return JenkinsMetricConverter.toMetricItem(jenkinsJob, jenkinsConfig);
  }

  supports(config: any): boolean {
    return config instanceof JenkinsCollectorConfig;
  }
}
