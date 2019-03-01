export interface ExternalConfig {
  since: Date;
  until?: Date;
  type: string;
  srcType: string;
  srcPath?: string;
  inlineData?: ExternalData[];
}

export class ExternalData {
  createdAt: Date;
  teamName: string;
  [type: string]: any;
}

export interface ExternalService {
  fetchExternalInfo(externalConfig: ExternalConfig): Promise<ExternalData[]>;
}

export interface ExternalRepository {
  csv(externalConfig: ExternalConfig): Promise<ExternalData[]>;
}
