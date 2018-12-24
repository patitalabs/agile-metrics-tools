import { JiraRepository } from "./JiraRepository";
import * as issueDetailsExpanded from "./test/issue-details-expanded-response.json";
import * as sprintFakeData from "./test/sprint-data-response.json";
import * as completedSprints from "./test/completed-sprint-since-response.json";
import { JiraClient, JiraConfig, Sprint } from "./Types";

describe("JiraRepository", () => {
  const jiraClient: JiraClient = {
    getData: async (url): Promise<any> => {
      if (/\/*\/?expand=changelog/.test(url)) {
        return issueDetailsExpanded;
      } else if (/\/rest\/agile\/.*\/board\/.*\/sprint\/.*\/issue/.test(url)) {
        return sprintFakeData;
      } else if (
        /\/rest\/agile\/.*\/board\/.*\/sprint\?state=closed/.test(url)
      ) {
        return completedSprints;
      }
      return {};
    }
  };
  const jiraRepository: JiraRepository = new JiraRepository(jiraClient);

  it("should get sprintData", async () => {
    const teamId = 1;
    const sprint: Sprint = {
      id: 2,
      isoEndDate: new Date("2018-12-14"),
      isoStartDate: new Date("2018-12-21"),
      name: "some name"
    };
    const jiraConfig: JiraConfig = {
      teamId: 1,
      since: new Date("2018-12-03")
    };
    const data = await jiraRepository.sprintData(jiraConfig, sprint);
    expect(data).toMatchSnapshot();
  });

  it("should get completedSprintsSince", async () => {
    const teamId = 1;
    const referenceDate: Date = new Date("2018-12-03");

    const data = await jiraRepository.completedSprintsSince(
      teamId,
      referenceDate
    );
    expect(data).toMatchSnapshot();
  });

  it("should get issueDetails", async () => {
    const issueId = "issue-id";

    const data = await jiraRepository.issueDetailsWithChangelog(issueId);
    expect(data).toMatchSnapshot();
  });
});
