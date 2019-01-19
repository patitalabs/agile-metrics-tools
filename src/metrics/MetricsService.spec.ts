import { MetricsService } from './MetricsService';
import { ElasticSearchService } from '../es';
import { CollectorConfig, CollectorService, MetricItem } from './Types';
import { MetricsConfig } from '../Types';

describe('MetricsService', () => {
  const elasticSearchService: ElasticSearchService = {
    push: (payload: MetricItem): Promise<any> => {
      return;
    }
  };

  const fakeCollector: CollectorService<CollectorConfig, MetricItem> = {
    fetch: async (config: CollectorConfig): Promise<MetricItem[]> => {
      return [
        {
          id: 'someId',
          dataType: 'someDataType',
          createdAt: new Date('2018-12-03')
        }
      ];
    },
    supports: (config: any): boolean => {
      return true;
    }
  };

  const collectors: CollectorService<CollectorConfig, MetricItem>[] = [
    fakeCollector
  ];

  it('should process githubMetrics', async () => {
    const spy = jest.spyOn(elasticSearchService, 'push');

    const metricsService: MetricsService = new MetricsService(
      elasticSearchService,
      collectors
    );

    const metricsConfig: MetricsConfig = {
      collectorConfigs: [{}]
    };

    await metricsService.start(metricsConfig);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
