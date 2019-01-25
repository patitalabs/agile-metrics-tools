import { AppConfig, AppContext, ModuleConfig } from './Types';
import { CollectorConfig, CollectorModuleFactory, Utils } from './metrics';
import { GithubModuleFactory } from './modules/github';
import { JiraModuleFactory } from './modules/jira';
import { JenkinsModuleFactory } from './modules/jenkins';
import { SonarqubeModuleFactory } from './modules/sonarqube';
import { ExternalModuleFactory } from './modules/external';

interface ModuleFactoryMappings {
  [type: string]: CollectorModuleFactory<any, any>;
}

export class AppContextFactory {
  static moduleFactoryMappings(): ModuleFactoryMappings {
    return {
      github: new GithubModuleFactory(),
      jira: new JiraModuleFactory(),
      jenkins: new JenkinsModuleFactory(),
      sonar: new SonarqubeModuleFactory(),
      external: new ExternalModuleFactory()
    };
  }

  static appContextForService(serviceName: string, config: string): AppContext {
    const moduleFactoryMapping: ModuleFactoryMappings = AppContextFactory.moduleFactoryMappings();
    const moduleFactory: CollectorModuleFactory<any, any> =
      moduleFactoryMapping[serviceName];

    if (!moduleFactory) {
      throw Error(`Unable to create module for service: ${serviceName}`);
    }

    const collectorService = moduleFactory.collectorInstance();

    return {
      appConfig: { indexPrefix: 'myindex', modules: [] },
      collectorsServices: [collectorService],
      collectorConfigs: [config]
    };
  }

  static async appContext(appConfig: AppConfig): Promise<AppContext> {
    const moduleFactoryMapping: ModuleFactoryMappings = AppContextFactory.moduleFactoryMappings();
    const supportedConfigs = AppContextFactory.supportedConfigs(
      appConfig,
      moduleFactoryMapping
    );

    const collectorConfigurations = await this.collectorConfigurations(
      moduleFactoryMapping,
      supportedConfigs
    );
    const collectorServices = supportedConfigs.map(moduleName => {
      return moduleFactoryMapping[moduleName.type].collectorInstance();
    });
    return {
      appConfig: appConfig,
      collectorsServices: collectorServices,
      collectorConfigs: collectorConfigurations
    };
  }

  private static supportedConfigs(
    appConfig: AppConfig,
    moduleFactories: ModuleFactoryMappings
  ): ModuleConfig[] {
    return appConfig.modules
      .map(moduleConfig => {
        if (!moduleConfig) {
          console.warn(`Unable to load ${moduleConfig}`);
          return null;
        }
        const module = moduleFactories[moduleConfig.type];
        if (!module) {
          console.warn(
            `Unable to process config for type ${moduleConfig.type}`
          );
          return null;
        }
        return moduleConfig;
      })
      .filter(moduleConfig => moduleConfig != null);
  }

  private static async collectorConfigurations(
    moduleFactories: ModuleFactoryMappings,
    supportedConfigs: ModuleConfig[]
  ): Promise<CollectorConfig[]> {
    const configContents: ModuleConfigurationDetails[] = await AppContextFactory.configurationDetails(
      supportedConfigs
    );

    const configsPerType: CollectorConfig[][] = configContents.map(
      configContent => {
        const entries = Array.isArray(configContent.entries)
          ? configContent.entries
          : [];
        return entries.map(item => {
          return moduleFactories[
            configContent.moduleConfig.type
          ].collectorConfiguration(item);
        });
      }
    );

    return Utils.flatMap(item => item, configsPerType);
  }

  private static async configurationDetails(
    supportedConfigs: ModuleConfig[]
  ): Promise<ModuleConfigurationDetails[]> {
    const configContentsPromises: Promise<
      ModuleConfigurationDetails
    >[] = supportedConfigs.map(async moduleConfig => {
      let configContents = null;
      try {
        configContents = await import(moduleConfig.configFile);
      } catch (error) {
        console.warn(`Unable to load file ${moduleConfig.configFile}`);
      }
      if (!configContents) {
        return null;
      }
      return { entries: configContents, moduleConfig: moduleConfig };
    });

    const configurationContents = await Promise.all(configContentsPromises);
    return configurationContents.filter(moduleConfig => moduleConfig != null);
  }
}

interface ModuleConfigurationDetails {
  entries: any[];
  moduleConfig: ModuleConfig;
}
