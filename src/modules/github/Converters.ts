import { Octokit } from '@octokit/rest';
import { GithubCommit, PullRequestStats } from './Types';
import { Utils } from '../../metrics';

export class Converters {
  static toGithubCommit(
    data: Octokit.GitGetCommitResponse,
    pullRequestStats: PullRequestStats
  ): GithubCommit {
    return {
      sha: data.sha,
      createdAt: new Date(data.committer.date),
      linesAdded: 0, // TODO data.stats.additions,
      linesRemoved: 0, //TODO data.stats.deletions,
      author: data.author ? data.author.email : data.committer.name, // TODO data.author.email vs data.author.login
      message: data.message,
      pullRequest: pullRequestStats
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
      numberOfComments: linkedPr.comments + prCommentsResponse.length
    };
  }
}
