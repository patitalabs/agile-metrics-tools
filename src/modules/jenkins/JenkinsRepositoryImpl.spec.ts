import * as projectBuildDetailsResponse from './test/project-build-details-response.json';
import * as projectDetailsResponse from './test/project-details-response.json';
import * as projectListResponse from './test/project-list-response.json';
import { JenkinsClient, JenkinsRepository } from './Types';
import { JenkinsRepositoryImpl } from './JenkinsRepositoryImpl';

describe('JenkinsRepository', () => {
  const jenkinsClient: JenkinsClient = {
    getData: (url): Promise<any> => {
      let result: any = projectListResponse;
      if (/.*job\/master\/\d+/.test(url)) {
        result = projectBuildDetailsResponse;
      } else if (/.*job\/master/.test(url)) {
        result = projectDetailsResponse;
      }
      return Promise.resolve(result);
    },
  };
  const jenkinsRepository: JenkinsRepository = new JenkinsRepositoryImpl(
    jenkinsClient
  );

  it('should get jobDetails data', async () => {
    const jenkinsJobs = await jenkinsRepository.jobDetails(
      'orgName',
      'project-name',
      new Date('2018-11-27')
    );

    expect(jenkinsJobs).toMatchSnapshot();
  });
});
