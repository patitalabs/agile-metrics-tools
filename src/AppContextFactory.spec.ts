import { AppContextFactory } from './AppContextFactory';
import { AppConfig, AppContext } from './Types';

function assertInvalidConfigs(appContext: AppContext) {
  expect(appContext.collectorsServices).not.toBeNull();
  expect(appContext.collectorsServices.length).toBe(1);

  expect(appContext.collectorConfigs).not.toBeNull();
  expect(appContext.collectorConfigs.length).toBe(0);
}

function givenAppConfig({ type, configFile }): AppConfig {
  return {
    indexPrefix: 'someIndexName',
    modules: [
      {
        type,
        configFile
      }
    ]
  };
}

describe('AppContextFactory', () => {
  it('should create appContext with supported module', async () => {
    const appConfig: AppConfig = {
      indexPrefix: 'someIndexName',
      modules: [
        {
          type: 'external',
          configFile: __dirname + '/test/test-external-config.json'
        }
      ]
    };
    const appContext: AppContext = await AppContextFactory.appContext(
      appConfig
    );
    expect(appContext.collectorsServices).not.toBeNull();
    expect(appContext.collectorsServices.length).toBe(1);

    expect(appContext.collectorConfigs).not.toBeNull();
    expect(appContext.collectorConfigs.length).toBe(1);
  });

  it('should create appContext without unsupported modules', async () => {
    const appConfig: AppConfig = givenAppConfig({
      type: 'some',
      configFile: '/some/test-external-config.json'
    });
    const appContext: AppContext = await AppContextFactory.appContext(
      appConfig
    );
    expect(appContext).toMatchSnapshot();
  });

  it('should create appContext without unsupported configs', async () => {
    const appConfig: AppConfig = givenAppConfig({
      type: 'external',
      configFile: __dirname + '/test/test-invalid-external-config.json'
    });
    const appContext: AppContext = await AppContextFactory.appContext(
      appConfig
    );
    assertInvalidConfigs(appContext);
  });

  it('should create appContext with not existent files', async () => {
    const appConfig = givenAppConfig({
      type: 'external',
      configFile: '/test/non-existent-file.json'
    });
    const appContext: AppContext = await AppContextFactory.appContext(
      appConfig
    );
    assertInvalidConfigs(appContext);
  });
});
