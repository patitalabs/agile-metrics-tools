import { SonarRepository } from "./SonarRepository";
import * as searchHistoryFakeData from "./test/search-history-response.json";
import * as searchProjectFakeData from "./test/search-project-analysis.json";
import { SonarClient } from "./Types";

describe("SonarRepository", () => {
  const sonarClient: SonarClient = {
    getData: async (url): Promise<any> => {
      if (/.*api\/measures\/search_history/.test(url)) {
        return searchHistoryFakeData;
      } else if (/.*api\/project_analyses\/search/.test(url)) {
        return searchProjectFakeData;
      }
      return {};
    }
  };
  const sonarRepository: SonarRepository = new SonarRepository(sonarClient);

  it("should get projectMetrics", async () => {
    const sonarConfig = { projectName: "someProject", since: "2018-11-20" };

    const data = await sonarRepository.projectMetrics(sonarConfig);
    expect(data).toMatchSnapshot();
  });
});
