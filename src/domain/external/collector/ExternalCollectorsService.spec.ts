import { ExternalCollectorService } from './ExternalCollectorService';
import { ExternalCollectorConfig } from './Types';
import { ExternalConfig, ExternalData, ExternalService } from '../Types';

function testExternalData(): ExternalData {
  return {
    createdAt: new Date('2018-12-06'),
    teamName: 'someTeamName',
    field1: 'someAdditionalData',
    field2: 4,
    field3: new Date('2018-12-07'),
  };
}

describe('ExternalCollectorsService', () => {
  const externalService: ExternalService = {
    fetch: (externalConfig: ExternalConfig): Promise<ExternalData[]> =>
      Promise.resolve([testExternalData()]),
  };

  const externalCollectorService: ExternalCollectorService =
    new ExternalCollectorService(externalService);

  it('should fetch inline metrics', async () => {
    const externalCollectorConfig: ExternalCollectorConfig =
      new ExternalCollectorConfig({
        since: '2018-11-20',
        type: 'someType',
        srcType: 'inline',
        metricType: 'someType',
        inlineData: [testExternalData()],
      });

    const data = await externalCollectorService.fetch(externalCollectorConfig);
    expect(data).toMatchSnapshot();
  });
});
