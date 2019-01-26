export class ProjectMetrics {
  createdAt: Date;
  projectName: string;
  alertStatus: string;
  qualityGateDetails: string;
  bugs: number;
  newBugs: number;
  reliabilityRating: number;
  newReliabilityRating: number;
  vulnerabilities: number;
  newVulnerabilities: number;
  securityRating: number;
  newSecurityRating: number;
  codeSmells: number;
  newCodeSmells: number;
  sqaleRating: number;
  newMaintainabilityRating: number;
  sqaleIndex: number;
  newTechnicalDebt: string;
  coverage: number;
  newCoverage: number;
  newLinesToCover: number;
  tests: number;
  duplicatedLinesDensity: number;
  newDuplicatedLinesDensity: number;
  duplicatedBlocks: number;
  ncloc: number;
  nclocLanguageDistribution: string;
  newLines: number;
  version: string;
}

export interface SonarConfig {
  projectName: string;
  since: string;
  until: string;
}

export interface SonarService {
  projectMetrics(sonarConfig: SonarConfig): Promise<ProjectMetrics[]>;
}

export interface SonarClient {
  getData(url: string): Promise<any>;
}

export interface SonarRepository {
  projectMetrics(sonarConfig: SonarConfig): Promise<ProjectMetrics[]>;
}
