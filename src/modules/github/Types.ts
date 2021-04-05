export class GithubCommit {
  sha: string;
  createdAt: Date;
  linesAdded: number;
  linesRemoved: number;
  author: string;
  message: string;
  pullRequest?: PullRequestStats;
}

export class PullRequestStats {
  prId: number;
  numberOfDaysOpen: number;
  numberOfComments: number;
}

export interface GithubConfig {
  repositoryName: string;
  orgName: string;
  since: string;
  until?: string;
}

export interface GithubRepository {
  commits(githubConfig: GithubConfig): Promise<GithubCommit[]>;
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

  pullRequestComments({
    owner,
    repo,

    number,
  }): Promise<any>;
}
