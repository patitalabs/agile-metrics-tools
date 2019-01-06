import { ExternalRepositoryImpl } from "./ExternalRepositoryImpl";
import { ExternalConfig, ExternalRepository } from "./Types";

describe("ExternalRepositoryImpl", () => {
  const externalRepository: ExternalRepository = new ExternalRepositoryImpl();

  it("should get csv properly", async () => {
    const externalConfig: ExternalConfig = {
      since: new Date("2018-12-03"),
      type: "csv",
      srcType: "file",
      srcPath: `${__dirname}/test/external-source.csv`
    };

    const externalData = await externalRepository.csv(externalConfig);
    expect(externalData).toMatchSnapshot();
  });
});
