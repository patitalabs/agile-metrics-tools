export interface CollectorService<
  T extends CollectorConfig,
  K extends MetricItem
> {
  fetch(config: T): Promise<K[]>;
  supports(config: any): boolean;
}

export interface MetricItem {
  id: string;
  dataType: string;
  createdAt: Date;
  teamName: string;
}

export interface CollectorConfig {
  teamName: string;
}

export interface CollectorModuleFactory<
  T extends CollectorConfig,
  K extends MetricItem
> {
  collectorInstance(): CollectorService<T, K>;
  collectorConfiguration(obj: any): T;
}
