import { GithubMetricConverter } from './GithubMetricConverter';
import { CollectorService } from '../../../metrics';
import { GithubCollectorConfig, GithubMetricItem } from './Types';
import { GithubService } from '../Types';

export class GithubCollectorService
  implements CollectorService<GithubCollectorConfig, GithubMetricItem> {
  constructor(private readonly githubService: GithubService) {}

  public async fetch(
    githubCollectorConfig: GithubCollectorConfig
  ): Promise<GithubMetricItem[]> {
    if (!this.supports(githubCollectorConfig)) {
      return [];
    }

    const commits = await this.githubService.commits(githubCollectorConfig);
    return GithubMetricConverter.toMetricItem(commits, githubCollectorConfig);
  }

  supports(config: any): boolean {
    return config instanceof GithubCollectorConfig;
  }
}
