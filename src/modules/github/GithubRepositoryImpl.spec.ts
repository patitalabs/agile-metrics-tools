import { GithubClient, GithubConfig, GithubRepository } from './Types';
import * as commitsFakeData from './test/commits-response.json';
import * as commitDetailsFakeData from './test/commit-details-response.json';
import * as commitPrFakeData from './test/commit-pr-response.json';
import * as commitPrReviewComentsFakeData from './test/pull-request-review-comments-response.json';
import { GithubRepositoryImpl } from './GithubRepositoryImpl';

describe('GithubRepository', () => {
  const githubClient: GithubClient = {
    async commits(githubConfig: GithubConfig): Promise<any> {
      return commitsFakeData;
    },
    async getCommitDetails(
      repositoryName: string,
      orgName: string,
      sha: string
    ): Promise<any> {
      return commitDetailsFakeData;
    },
    async pullRequestForCommit(sha: string): Promise<any> {
      return commitPrFakeData;
    },
    async pullRequestComments({
      owner,
      repo,

      number
    }): Promise<any> {
      return commitPrReviewComentsFakeData;
    }
  };

  const githubService: GithubRepository = new GithubRepositoryImpl(
    githubClient
  );

  it('should get commits', async () => {
    const githubConfig: GithubConfig = {
      repositoryName: 'someRepositoryName',
      orgName: 'someOrgName',
      since: '2018-12-03'
    };
    const data = await githubService.commits(githubConfig);
    expect(data).toMatchSnapshot();
  });
});
