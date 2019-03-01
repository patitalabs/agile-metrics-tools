import * as Octokit from '@octokit/rest';
import { GithubClient, GithubConfig } from './Types';
import Bottleneck from 'bottleneck';

const limiter = new Bottleneck({
  reservoir: 30,
  reservoirRefreshAmount: 30,
  reservoirRefreshInterval: 60 * 1000,
  minTime: 333,
  maxConcurrent: 1
});

//TODO deal with pagination
export class GithubClientImpl implements GithubClient {
  private readonly octokit: Octokit;
  private readonly token: string;
  constructor({ token }) {
    this.token = token;

    this.octokit = new Octokit({
      auth: `token ${token}`
    });
  }

  async commits(githubConfig: GithubConfig): Promise<string[]> {
    const reposGetCommitsParams: Octokit.ReposListCommitsParams = {
      owner: githubConfig.orgName,
      repo: githubConfig.repositoryName,
      since: githubConfig.since,
      sha: 'master'
    };

    if (githubConfig.until) {
      reposGetCommitsParams.until = githubConfig.until;
    }

    const { data: commitResponseItems } = await limiter.schedule(() => {
      return this.octokit.repos.listCommits(reposGetCommitsParams);
    });
    return commitResponseItems.map(commit => commit.sha);
  }

  async getCommitDetails(
    repositoryName: string,
    orgName: string,
    sha: string
  ): Promise<any> {
    const commitConfig = {
      owner: orgName,
      repo: repositoryName,
      sha
    };
    const { data } = await this.octokit.repos.getCommit(commitConfig);
    return data;
  }

  async pullRequestForCommit(sha: string): Promise<any> {
    const { data } = await limiter.schedule(() => {
      return this.octokit.search.issuesAndPullRequests({
        q: `${sha} is:merged type:pr`
      });
    });
    return data;
  }

  async pullRequestComments({
    owner,
    repo,

    number
  }): Promise<any> {
    const paramsConfig = { owner, repo, number };
    const { data } = await limiter.schedule(() => {
      return this.octokit.pulls.listComments(paramsConfig);
    });
    return data;
  }
}
