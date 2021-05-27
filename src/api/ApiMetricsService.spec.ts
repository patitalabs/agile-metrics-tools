import { ApiMetricsService } from './ApiMetricsService';
import { TeamMetricsRequest } from '../domain/Types';

describe('ApiMetricsService', () => {
  it('should return existing unchanged config', () => {
    const teamMetricsRequest: TeamMetricsRequest = {
      shouldUpdateEntries: false,
      config: { fake: 'config' },
    };
    const generatedConfigs =
      ApiMetricsService.createConfigurationDescriptorsForRequest(
        teamMetricsRequest
      );
    expect(generatedConfigs).toMatchSnapshot();
  });
});
