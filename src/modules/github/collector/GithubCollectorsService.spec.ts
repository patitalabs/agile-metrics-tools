import { GithubCollectorConfig } from './Types';
import { GithubCommit, GithubConfig, GithubService } from '../Types';
import { GithubCollectorService } from './GithubCollectorService';

function testCommit(): GithubCommit {
  return {
    sha: 'someSha',
    createdAt: new Date('2018-12-06'),
    linesAdded: 30,
    linesRemoved: 6,
    author: 'someAuthor',
    message: 'someMessage'
  };
}

describe('GithubCollectorsService', () => {
  const githubService: GithubService = {
    commits: (githubConfig: GithubConfig): Promise<GithubCommit[]> =>
      Promise.resolve([testCommit()])
  };

  const githubCollectorsService: GithubCollectorService = new GithubCollectorService(
    githubService
  );

  it('should fetch githubMetrics', async () => {
    const githubCollectorConfig: GithubCollectorConfig = new GithubCollectorConfig(
      {
        teamName: 'someTeamName',
        repositoryName: 'someRepoName',
        orgName: 'someOrgName',
        since: '2018-11-20',
        until: '2020-11-20'
      }
    );

    const data = await githubCollectorsService.fetch(githubCollectorConfig);
    expect(data).toMatchSnapshot();
  });
});
