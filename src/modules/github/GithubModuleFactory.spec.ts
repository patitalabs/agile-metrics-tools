import { GithubModuleFactory } from './GithubModuleFactory';

describe('GithubModuleFactory', () => {
  const githubModuleFactory: GithubModuleFactory = new GithubModuleFactory();

  beforeEach(() => {
    jest.resetModules();
    delete process.env.GITHUB_TOKEN;
  });

  it('should create collector', () => {
    process.env.GITHUB_TOKEN = 'SOME_TOKEN';
    const collectorInstance = githubModuleFactory.collectorInstance();
    expect(collectorInstance).not.toBeNull();
  });

  it('should fail to create collector', () => {
    expect(() =>
      githubModuleFactory.collectorInstance()
    ).toThrowErrorMatchingSnapshot();
  });

  it('should create collectorConfiguration', () => {
    const collectorConfiguration = githubModuleFactory.collectorConfiguration(
      {}
    );
    expect(collectorConfiguration).not.toBeNull();
  });
});
