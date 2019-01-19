import { JenkinsModuleFactory } from './JenkinsModuleFactory';

describe('JenkinsModuleFactory', () => {
  const jenkinsModuleFactory: JenkinsModuleFactory = new JenkinsModuleFactory();

  beforeEach(() => {
    jest.resetModules();
    delete process.env.JENKINS_HOST;
    delete process.env.JENKINS_API_TOKEN;
    delete process.env.JENKINS_USER;
  });

  it('should create collector', () => {
    process.env.JENKINS_HOST = 'SOME_TOKEN';
    process.env.JENKINS_API_TOKEN = 'SOME_TOKEN';
    process.env.JENKINS_USER = 'SOME_TOKEN';
    const collectorInstance = jenkinsModuleFactory.collectorInstance();
    expect(collectorInstance).not.toBeNull();
  });

  it('should fail to create collector', () => {
    expect(
      jenkinsModuleFactory.collectorInstance
    ).toThrowErrorMatchingSnapshot();
  });

  it('should create collectorConfiguration', () => {
    const collectorConfiguration = jenkinsModuleFactory.collectorConfiguration(
      {}
    );
    expect(collectorConfiguration).not.toBeNull();
  });
});
