import { SonarCollectorConfig } from './Types';
import { SonarCollectorsService } from './SonarCollectorsService';
import { ProjectMetrics, SonarConfig, SonarService } from '../Types';

function testProjectMetric(): ProjectMetrics {
  return {
    createdAt: new Date('2018-12-20'),
    teamName: 'someTeamName',
    projectName: 'the project',
    alertStatus: 'OK',
    qualityGateDetails: 'Passed',
    bugs: 1,
    newBugs: 2,
    reliabilityRating: 3,
    newReliabilityRating: 2,
    vulnerabilities: 8,
    newVulnerabilities: 1,
    securityRating: 1,
    newSecurityRating: 1,
    codeSmells: 30,
    newCodeSmells: 3,
    sqaleRating: 1,
    newMaintainabilityRating: 2,
    sqaleIndex: 1,
    newTechnicalDebt: 'technical debt text',
    coverage: 60,
    newCoverage: 60,
    newLinesToCover: 50,
    tests: 20,
    duplicatedLinesDensity: 30,
    newDuplicatedLinesDensity: 10,
    duplicatedBlocks: 10,
    ncloc: 40,
    nclocLanguageDistribution: 'lang distribution',
    newLines: 20,
    version: '2.5'
  };
}

describe('SonarCollectorsService', () => {
  const sonarService: SonarService = {
    projectMetrics: (sonarConfig: SonarConfig): Promise<ProjectMetrics[]> =>
      Promise.resolve([testProjectMetric()])
  };

  const sonarCollectorsService: SonarCollectorsService = new SonarCollectorsService(
    sonarService
  );

  it('should fetch sonarMetrics', async () => {
    const sonarCollectorConfig: SonarCollectorConfig = new SonarCollectorConfig(
      {
        projectName: 'someProject',
        since: '2018-11-20',
        until: '2020-11-20',
        teamName: 'someTeamName'
      }
    );

    const data = await sonarCollectorsService.fetch(sonarCollectorConfig);
    expect(data).toMatchSnapshot();
  });
});
