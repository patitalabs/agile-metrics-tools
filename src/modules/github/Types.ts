export class GithubCommit {
  sha: string;
  createdAt: Date;
  linesAdded: number;
  linesRemoved: number;
  author: string;
  message: string;
  pullRequest?: PullRequest;
}

export class PullRequest {
  id: number;
  numberOfDaysOpen: number;
  numberOfComments: number;
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
  commits(githubConfig: GithubConfig): Promise<string[]>;

  getCommitDetails(
    repositoryName: string,
    orgName: string,
    sha: string
  ): Promise<any>;

  pullRequestForCommit(sha: string): Promise<any>;
}
