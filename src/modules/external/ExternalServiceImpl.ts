import {
  ExternalConfig,
  ExternalData,
  ExternalRepository,
  ExternalService
} from './Types';

export class ExternalServiceImpl implements ExternalService {
  constructor(private externalRepository: ExternalRepository) {}

  async fetchExternalInfo(
    externalConfig: ExternalConfig
  ): Promise<ExternalData[]> {
    if (externalConfig.type === 'csv') {
      return this.externalRepository.csv(externalConfig);
    }
    return [];
  }
}
