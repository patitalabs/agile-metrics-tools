import { SonarRepository } from "./SonarRepository";
import { ProjectMetrics, SonarConfig, SonarService } from "./Types";

export class SonarServiceImpl implements SonarService {
  constructor(private sonarRepository: SonarRepository) {}

  projectMetrics(sonarConfig: SonarConfig): Promise<ProjectMetrics[]> {
    return this.sonarRepository.projectMetrics(sonarConfig);
  }
}
