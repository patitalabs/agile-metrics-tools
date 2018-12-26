import { CollectorModuleFactory, Utils } from "../../metrics";
import { GithubCollectorConfig, GithubMetricItem } from "./collector/Types";
import { GithubService } from "./Types";
import { GithubClientImpl } from "./GithubClientImpl";
import { GithubServiceImpl } from "./GithubServiceImpl";
import { GithubCollectorService } from "./collector/GithubCollectorService";
import {GithubRepositoryImpl} from "./GithubRepositoryImpl";

export class GithubModuleFactory
  implements CollectorModuleFactory<GithubCollectorConfig, GithubMetricItem> {
  private static githubService(): GithubService {
    Utils.checkEnvVar("GITHUB_TOKEN");
    const githubClient = new GithubClientImpl({
      token: `${process.env.GITHUB_TOKEN}`
    });
    const githubRepository = new GithubRepositoryImpl(githubClient);
    return new GithubServiceImpl(githubRepository);
  }

  collectorInstance(): GithubCollectorService {
    return new GithubCollectorService(GithubModuleFactory.githubService());
  }

  collectorConfiguration(obj: any): GithubCollectorConfig {
    return new GithubCollectorConfig(obj);
  }
}
