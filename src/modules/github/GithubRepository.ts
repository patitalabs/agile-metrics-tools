import { GithubClient, GithubCommit, GithubConfig } from "./Types";
import { Converters } from "./Converters";

export class GithubRepository {
  constructor(private githubClient: GithubClient) {}

  async commits(githubConfig: GithubConfig): Promise<GithubCommit[]> {
    const { repositoryName, orgName } = githubConfig;

    const commitsResponse = await this.githubClient.commits(githubConfig);
    const commitsWithDetails = commitsResponse.map(commit => {
      return this.getCommitDetails(repositoryName, orgName, commit.sha);
    });
    return await Promise.all(commitsWithDetails);
  }

  private async getCommitDetails(
    repositoryName: string,
    orgName: string,
    sha: string
  ): Promise<GithubCommit> {
    const commitDetailsResponse = await this.githubClient.getCommitDetails(
      repositoryName,
      orgName,
      sha
    );

    return Converters.toGithubCommit(commitDetailsResponse);
  }

  async allPullRequests(repositoryName: string, orgName: string): Promise<any> {
    return await this.githubClient.allPullRequests(repositoryName, orgName);
  }
}
