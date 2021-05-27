import { ExternalRepositoryImpl } from './ExternalRepositoryImpl';
import { ExternalConfig, ExternalRepository } from './Types';

describe('ExternalRepositoryImpl', () => {
  const externalRepository: ExternalRepository = new ExternalRepositoryImpl();

  it('should get inline values properly', async () => {
    const externalConfig: ExternalConfig = {
      since: new Date('2018-12-03'),
      type: 'csv',
      srcType: 'inline',
      inlineData: [
        {
          createdAt: new Date('2018-12-04T00:00:00.000Z'),
          teamName: 'someTeamName',
          header1: 2,
          header2: 3,
          header3: 'someValue',
        },
      ],
    };

    const externalData = await externalRepository.csv(externalConfig);
    expect(externalData).toMatchSnapshot();
  });
});
