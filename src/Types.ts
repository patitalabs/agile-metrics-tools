import { CollectorConfig, CollectorService } from "./metrics/Types";

export interface MetricsConfig {
  collectorConfigs: CollectorConfig[];
}

export interface AppConfig {
  indexPrefix: string;
  modules: ModuleConfig[];
}

export interface ModuleConfig {
  type: string;
  configFile: string;
}

export interface AppContext {
  appConfig: AppConfig;
  collectorConfigs: CollectorConfig[];
  collectorsServices: CollectorService<any, any>[];
}
