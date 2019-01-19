import * as Github from '@octokit/rest';
import { ReposGetCommitsParams } from '@octokit/rest';
import { GithubClient, GithubConfig } from './Types';

//TODO deal with pagination and ratelimit
export class GithubClientImpl implements GithubClient {
  private octokit: Github;
  private readonly token: string;
  constructor({ token }) {
    this.token = token;
    this.octokit = new Github();
  }

  private authenticate() {
    this.octokit.authenticate({
      type: 'token',
      token: this.token
    });
  }

  async commits(githubConfig: GithubConfig): Promise<string[]> {
    this.authenticate();
    const reposGetCommitsParams: ReposGetCommitsParams = {
      owner: githubConfig.orgName,
      repo: githubConfig.repositoryName,
      since: githubConfig.since,
      sha: 'master'
    };

    const { data: commitResponseItems } = await this.octokit.repos.getCommits(
      reposGetCommitsParams
    );
    return commitResponseItems.map(commit => commit.sha);
  }

  async getCommitDetails(
    repositoryName: string,
    orgName: string,
    sha: string
  ): Promise<any> {
    this.authenticate();
    const commitConfig = {
      owner: orgName,
      repo: repositoryName,
      sha: sha
    };
    const { data } = await this.octokit.repos.getCommit(commitConfig);
    return data;
  }

  async pullRequestForCommit(sha: string): Promise<any> {
    const { data } = await this.octokit.search.issues({
      q: `${sha} is:merged type:pr`
    });
    return data;
  }

  async pullRequestComments({
    owner,
    repo,

    number
  }): Promise<any> {
    const paramsConfig = { owner: owner, repo: repo, number: number };
    const { data } = await this.octokit.pullRequests.getComments(paramsConfig);
    return data;
  }
}
