import { ExternalCollectorConfig } from '../external/collector/Types';

export interface CollectorService {
  fetch(config: ExternalCollectorConfig): Promise<MetricItem[]>;
}

export interface MetricItem {
  id: string;
  dataType: string;
  createdAt: Date;
  teamName: string;
}
