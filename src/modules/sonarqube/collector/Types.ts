import { CollectorConfig, MetricItem } from '../../../metrics';

export interface SonarMetricItem extends MetricItem {
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

export class SonarCollectorConfig implements CollectorConfig {
  projectName: string;
  teamName: string;
  since: string;
  until?: string;

  constructor({ projectName, since, until = null, teamName }) {
    this.projectName = projectName;
    this.since = since;
    this.until = until;
    this.teamName = teamName;
  }
}
