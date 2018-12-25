import { SonarqubeModuleFactory } from "./SonarqubeModuleFactory";

describe("SonarqubeModuleFactory", () => {
  const sonarqubeModuleFactory: SonarqubeModuleFactory = new SonarqubeModuleFactory();

  beforeEach(() => {
    jest.resetModules();
    delete process.env.SONAR_HOST;
  });

  it("should create collector", () => {
    process.env.SONAR_HOST = "SOME_TOKEN";
    const collectorInstance = sonarqubeModuleFactory.collectorInstance();
    expect(collectorInstance).not.toBeNull();
  });

  it("should fail to create collector", () => {
    expect(
      sonarqubeModuleFactory.collectorInstance
    ).toThrowErrorMatchingSnapshot();
  });

  it("should create collectorConfiguration", () => {
    const collectorConfiguration = sonarqubeModuleFactory.collectorConfiguration(
      {}
    );
    expect(collectorConfiguration).not.toBeNull();
  });
});
