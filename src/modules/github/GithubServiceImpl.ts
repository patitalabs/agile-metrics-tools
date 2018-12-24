import { GithubRepository } from "./GithubRepository";
import { GithubCommit, GithubConfig, GithubService } from "./Types";

export class GithubServiceImpl implements GithubService {
  constructor(private githubRepository: GithubRepository) {}

  async commits(githubConfig: GithubConfig): Promise<GithubCommit[]> {
    const commits = await this.githubRepository.commits(githubConfig);
    return commits || [];
  }
}
