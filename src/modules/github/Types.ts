import {
  PullRequestsGetAllResponse,
  ReposGetCommitResponse,
  ReposGetCommitsResponse
} from "@octokit/rest";

export class GithubCommit {
  sha: string;
  createdAt: Date;
  linesAdded: number;
  linesRemoved: number;
  author: string;
  message: string;
}

export interface GithubConfig {
  repositoryName: string;
  orgName: string;
  since: string;
}

export interface GithubService {
  commits(githubConfig: GithubConfig): Promise<GithubCommit[]>;
}

export interface GithubClient {
  commits(githubConfig: GithubConfig): Promise<ReposGetCommitsResponse>;

  getCommitDetails(
    repositoryName: string,
    orgName: string,
    sha: string
  ): Promise<ReposGetCommitResponse>;

  allPullRequests(
    repositoryName: string,
    orgName: string
  ): Promise<PullRequestsGetAllResponse>;
}
