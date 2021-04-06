import { GithubCommit, PullRequestStats } from './Types';
import { Utils } from '../../metrics';

export class Converters {
  static toGithubCommit(
    data: any,
    pullRequestStats: PullRequestStats
  ): GithubCommit {
    return {
      sha: data.sha,
      createdAt: new Date(data.commit.committer.date),
      linesAdded: data.stats.additions,
      linesRemoved: data.stats.deletions,
      author: data.author ? data.author.login : data.commit.committer.name,
      message: data.commit.message,
      pullRequest: pullRequestStats,
    };
  }

  static pullRequestStats(
    commitPrResponse: any,
    prCommentsResponse: any
  ): PullRequestStats {
    const linkedPr = commitPrResponse.items[0];
    return {
      prId: linkedPr.number,
      numberOfDaysOpen: Utils.daysBetween(
        new Date(linkedPr.created_at),
        new Date(linkedPr.closed_at)
      ),
      numberOfComments: linkedPr.comments + prCommentsResponse.length,
    };
  }
}
