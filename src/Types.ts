import { CollectorConfig, CollectorService } from './metrics';

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

export interface TeamMetricsRequest {
  shouldUpdateEntries: boolean;
}

export interface TeamMetricsRequestByService extends TeamMetricsRequest {
  serviceName: string;
  config: any;
}

export interface TeamMetricsRequestByTeam extends TeamMetricsRequest {
  teamName?: string;
  since?: Date;
  until?: Date;
}
