export interface ExternalConfig {
  since: Date;
  until?: Date;
  type: string;
  srcType: string;
  srcPath: string;
}

export class ExternalData {
  createdAt: Date;
  [type: string]: any;
}

export interface ExternalService {
  fetchExternalInfo(externalConfig: ExternalConfig): Promise<ExternalData[]>;
}

export interface ExternalRepository {
  csv(externalConfig: ExternalConfig): Promise<ExternalData[]>;
}
