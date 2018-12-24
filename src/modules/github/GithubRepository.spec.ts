import { GithubRepository } from "./GithubRepository";
import { GithubClient, GithubConfig } from "./Types";
import {
  PullRequestsGetAllResponse,
  ReposGetCommitResponse,
  ReposGetCommitsResponse
} from "@octokit/rest";
import * as commitsFakeData from "./test/commits-response.json";
import * as commitDetailsFakeData from "./test/commit-details-response.json";

describe("GithubRepository", () => {
  const githubClient: GithubClient = {
    commits(githubConfig: GithubConfig): Promise<ReposGetCommitsResponse> {
      return Promise.resolve(commitsFakeData);
    },
    getCommitDetails(
      repositoryName: string,
      orgName: string,
      sha: string
    ): Promise<ReposGetCommitResponse> {
      return Promise.resolve(commitDetailsFakeData);
    },

    allPullRequests(
      repositoryName: string,
      orgName: string
    ): Promise<PullRequestsGetAllResponse> {
      return Promise.resolve([]);
    }
  };

  const githubService: GithubRepository = new GithubRepository(githubClient);

  it("should get pull requests", async () => {
    const pullRequests = await githubService.allPullRequests(
      "someRepositoryName",
      "someOrgName"
    );
    expect(pullRequests).toMatchSnapshot();
  });

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
