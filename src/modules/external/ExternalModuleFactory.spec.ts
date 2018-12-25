import {ExternalModuleFactory} from "./ExternalModuleFactory";

describe("ExternalModuleFactory", () => {
  const externalModuleFactory: ExternalModuleFactory = new ExternalModuleFactory();

  it("should create collector", () => {
    const collectorInstance = externalModuleFactory.collectorInstance();
    expect(collectorInstance).not.toBeNull();
  });

  it("should create collectorConfiguration", () => {
    const collectorConfiguration = externalModuleFactory.collectorConfiguration(
      {}
    );
    expect(collectorConfiguration).not.toBeNull();
  });
});
