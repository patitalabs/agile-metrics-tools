import { ReposGetCommitResponse } from "@octokit/rest";
import { GithubCommit, PullRequestStats } from "./Types";
import { Utils } from "../../metrics";

export class Converters {
  static toGithubCommit(
    data: ReposGetCommitResponse,
    commitPrResponse: any
  ): GithubCommit {
    return {
      sha: data.sha,
      createdAt: new Date(data.commit.committer.date),
      linesAdded: data.stats.additions,
      linesRemoved: data.stats.deletions,
      author: data.author ? data.author.login : data.commit.committer.name,
      message: data.commit.message,
      pullRequest: Converters.pullRequestStats(commitPrResponse)
    };
  }

  private static pullRequestStats(commitPrResponse: any): PullRequestStats {
    let pullRequest: PullRequestStats = null;
    if (commitPrResponse && commitPrResponse.total_count > 0) {
      const linkedPr = commitPrResponse.items[0];
      pullRequest = {
        prId: linkedPr.number,
        numberOfDaysOpen: Utils.daysBetween(
          new Date(linkedPr.created_at),
          new Date(linkedPr.closed_at)
        ),
        numberOfComments: linkedPr.comments
      };
    }
    return pullRequest;
  }
}
