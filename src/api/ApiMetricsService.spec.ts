import { ApiMetricsService } from './ApiMetricsService';
import {
  TeamMetricsRequestByService,
  TeamMetricsRequestByTeam,
} from '../Types';

describe('ApiMetricsService', () => {
  it('should construct default config', async () => {
    const teamMetricsRequest: TeamMetricsRequestByTeam = {
      shouldUpdateEntries: false,
      teamName: 'sprintteam',
    };
    const referenceDate = new Date('2019-02-10');
    const generatedConfigs = await ApiMetricsService.createConfigurationDescriptorsForRequest(
      teamMetricsRequest,
      referenceDate
    );
    expect(generatedConfigs).toMatchSnapshot();
  });

  it('should fail with invalid configuration', async () => {
    const teamMetricsRequest: TeamMetricsRequestByService = {
      serviceName: 'serviceName',
      shouldUpdateEntries: false,
      config: { fake: 'config' },
    };
    const referenceDate = new Date('2019-02-09');

    try {
      await ApiMetricsService.createConfigurationDescriptorsForRequest(
        teamMetricsRequest,
        referenceDate
      );
    } catch (e) {
      expect(e).toMatchSnapshot();
    }
  });

  it('should return existing unchanged config', async () => {
    const teamMetricsRequest: TeamMetricsRequestByService = {
      serviceName: 'serviceName',
      shouldUpdateEntries: false,
      config: { fake: 'config' },
    };
    const referenceDate = new Date('2019-02-12');
    const generatedConfigs = await ApiMetricsService.createConfigurationDescriptorsForRequest(
      teamMetricsRequest,
      referenceDate
    );
    expect(generatedConfigs).toMatchSnapshot();
  });
});
