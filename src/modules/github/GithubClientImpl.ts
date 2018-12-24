import * as Github from "@octokit/rest";
import {
  PullRequestsGetAllParams,
  PullRequestsGetAllResponse,
  ReposGetCommitResponse,
  ReposGetCommitsParams,
  ReposGetCommitsResponse,
  ReposGetForOrgResponse
} from "@octokit/rest";
import { GithubClient, GithubConfig } from "./Types";

export class GithubClientImpl implements GithubClient {
  private octokit: Github;
  private readonly token: string;
  constructor({ token }) {
    this.token = token;
    this.octokit = new Github();
  }

  private authenticate() {
    this.octokit.authenticate({
      type: "token",
      token: this.token
    });
  }

  async repos(orgName): Promise<ReposGetForOrgResponse> {
    this.authenticate();
    const { data } = await this.octokit.repos.getForOrg({
      org: orgName,
      type: "private"
    });
    return data;
  }

  async commits(githubConfig: GithubConfig): Promise<ReposGetCommitsResponse> {
    this.authenticate();
    const reposGetCommitsParams: ReposGetCommitsParams = {
      owner: githubConfig.orgName,
      repo: githubConfig.repositoryName,
      since: githubConfig.since
    };

    const { data } = await this.octokit.repos.getCommits(reposGetCommitsParams);
    return data;
  }

  async getCommitDetails(
    repositoryName: string,
    orgName: string,
    sha: string
  ): Promise<ReposGetCommitResponse> {
    const commitConfig = {
      owner: orgName,
      repo: repositoryName,
      sha: sha
    };
    const { data } = await this.octokit.repos.getCommit(commitConfig);
    return data;
  }

  async allPullRequests(
    repositoryName: string,
    orgName: string
  ): Promise<PullRequestsGetAllResponse> {
    this.authenticate();
    const config: PullRequestsGetAllParams = {
      owner: orgName,
      repo: repositoryName,
      state: "closed",
      head: "master"
    };

    const { data } = await this.octokit.pullRequests.getAll(config);
    return data;
  }
}
