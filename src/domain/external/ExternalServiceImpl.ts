import {
  ExternalConfig,
  ExternalData,
  ExternalRepository,
  ExternalService,
} from './Types';

export class ExternalServiceImpl implements ExternalService {
  constructor(private readonly externalRepository: ExternalRepository) {}

  async fetch(externalConfig: ExternalConfig): Promise<ExternalData[]> {
    return this.externalRepository.csv(externalConfig);
  }
}
