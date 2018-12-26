import { GithubRepository } from "./GithubRepository";
import { GithubClient, GithubConfig } from "./Types";
import * as commitsFakeData from "./test/commits-response.json";
import * as commitDetailsFakeData from "./test/commit-details-response.json";
import * as commitPrFakeData from "./test/commit-pr-response.json";

describe("GithubRepository", () => {
  const githubClient: GithubClient = {
    commits(githubConfig: GithubConfig): Promise<any> {
      return Promise.resolve(commitsFakeData);
    },
    getCommitDetails(
      repositoryName: string,
      orgName: string,
      sha: string
    ): Promise<any> {
      return Promise.resolve(commitDetailsFakeData);
    },
    pullRequestForCommit(sha: string): Promise<any> {
      return Promise.resolve(commitPrFakeData);
    }
  };

  const githubService: GithubRepository = new GithubRepository(githubClient);

  it("should get commits", async () => {
    const githubConfig: GithubConfig = {
      repositoryName: "someRepositoryName",
      orgName: "someOrgName",
      since: "2018-12-03"
    };
    const data = await githubService.commits(githubConfig);
    expect(data).toMatchSnapshot();
  });
});
