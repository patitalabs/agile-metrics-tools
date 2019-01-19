import { ExternalCollectorService } from './ExternalCollectorService';
import { ExternalCollectorConfig } from './Types';
import { ExternalConfig, ExternalData, ExternalService } from '../Types';

function testExternalData(): ExternalData {
  return {
    createdAt: new Date('2018-12-06'),
    field1: 'someAdditionalData',
    field2: 4,
    field3: new Date('2018-12-07')
  };
}

describe('ExternalCollectorsService', () => {
  const externalService: ExternalService = {
    fetchExternalInfo: async (
      externalConfig: ExternalConfig
    ): Promise<ExternalData[]> => {
      return [testExternalData()];
    }
  };

  const externalCollectorService: ExternalCollectorService = new ExternalCollectorService(
    externalService
  );

  it('should fetch githubMetrics', async () => {
    const externalCollectorConfig: ExternalCollectorConfig = new ExternalCollectorConfig(
      {
        since: '2018-11-20',
        type: 'someType',
        srcType: 'file',
        srcPath: 'some/path',
        metricType: 'someType'
      }
    );

    const data = await externalCollectorService.fetch(externalCollectorConfig);
    expect(data).toMatchSnapshot();
  });
});
