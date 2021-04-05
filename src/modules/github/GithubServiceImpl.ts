import {
  GithubCommit,
  GithubConfig,
  GithubRepository,
  GithubService,
} from './Types';

export class GithubServiceImpl implements GithubService {
  constructor(private readonly githubRepository: GithubRepository) {}

  async commits(githubConfig: GithubConfig): Promise<GithubCommit[]> {
    const commits = await this.githubRepository.commits(githubConfig);
    return commits || [];
  }
}
