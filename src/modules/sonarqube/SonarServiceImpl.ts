import {
  ProjectMetrics,
  SonarConfig,
  SonarRepository,
  SonarService,
} from './Types';

export class SonarServiceImpl implements SonarService {
  constructor(private readonly sonarRepository: SonarRepository) {}

  projectMetrics(sonarConfig: SonarConfig): Promise<ProjectMetrics[]> {
    return this.sonarRepository.projectMetrics(sonarConfig);
  }
}
