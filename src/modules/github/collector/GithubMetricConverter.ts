import { GithubCommit } from '../Types';
import { GithubCollectorConfig, GithubMetricItem } from './Types';

export class GithubMetricConverter {
  static toMetricItem(
    githubCommits: GithubCommit[],
    githubConfig: GithubCollectorConfig
  ): GithubMetricItem[] {
    return githubCommits.map(commit => {
      return {
        id: commit.sha,
        dataType: 'SCM',
        repositoryName: githubConfig.repositoryName,
        teamName: githubConfig.teamName,
        ...commit
      };
    });
  }
}
