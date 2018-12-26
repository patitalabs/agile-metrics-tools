import {ReposGetCommitResponse} from "@octokit/rest";
import {GithubCommit} from "./Types";

export class Converters {
  static toGithubCommit(data: ReposGetCommitResponse, commitPrResponse: any): GithubCommit {
    //TODO use commitPrResponse
    return {
      sha: data.sha,
      createdAt: new Date(data.commit.committer.date),
      linesAdded: data.stats.additions,
      linesRemoved: data.stats.deletions,
      author: data.author ? data.author.login : data.commit.committer.name,
      message: data.commit.message
    };
  }
}
