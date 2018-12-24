import { GithubService } from "./Types";
import { GithubClientImpl } from "./GithubClientImpl";
import { GithubRepository } from "./GithubRepository";
import { GithubServiceImpl } from "./GithubServiceImpl";
import { GithubCollectorService } from "./collector/GithubCollectorService";
import { checkEnvVar } from "../../metrics/Utils";
import { GithubCollectorConfig, GithubMetricItem } from "./collector/Types";
import { CollectorModuleFactory } from "../../metrics/Types";

export { GithubService } from "./Types";
export { GithubCollectorService } from "./collector/GithubCollectorService";

export class GithubModuleFactory
  implements CollectorModuleFactory<GithubCollectorConfig, GithubMetricItem> {
  private static githubService(): GithubService {
    checkEnvVar("GITHUB_TOKEN");
    const githubClient = new GithubClientImpl({
      token: `${process.env.GITHUB_TOKEN}`
    });
    const githubRepository = new GithubRepository(githubClient);
    return new GithubServiceImpl(githubRepository);
  }

  collectorInstance(): GithubCollectorService {
    return new GithubCollectorService(GithubModuleFactory.githubService());
  }

  collectorConfiguration(obj: any): GithubCollectorConfig {
    return new GithubCollectorConfig(obj);
  }
}
