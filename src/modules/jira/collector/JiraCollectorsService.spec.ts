import {
  HistoryEntry,
  JiraConfig,
  JiraService,
  Sprint,
  SprintSubtask,
  SprintTask
} from "../Types";
import { JiraCollectorsService } from "./JiraCollectorsService";
import { JiraCollectorConfig } from "./Types";

function testSubtasks(): SprintSubtask[] {
  return [{ key: "someKey-12", statusName: "Done" }];
}

function testHistories(): { [type: string]: HistoryEntry[] } {
  const historyEntry: HistoryEntry = {
    category: "string",
    created: new Date("2018-12-04"),
    items: [
      {
        field: "status",
        fromString: "Open",
        toString: "Done"
      }
    ]
  };
  return {
    status: [historyEntry]
  };
}

function testSprintTask(): SprintTask {
  return {
    key: "someKey-1",
    typeName: "Story",
    statusName: "Done",
    assignee: "someone",
    epic: "someEpic",
    sprint: testSprint(),
    created: new Date("2018-12-02"),
    projectName: "someProject",
    teamName: "someTeam",
    createdBy: "someone",
    resolutionDate: new Date("2018-12-06"),
    storyPoints: 2,
    labels: ["label1", "label2"],
    subtasks: testSubtasks(),
    histories: testHistories(),
    numberOfComments: 4,
    numberOfBugs: 1
  };
}

function testSprint(): Sprint {
  return {
    id: 45,
    name: "sprint name",
    isoStartDate: new Date("2018-12-03"),
    isoEndDate: new Date("2018-12-11")
  };
}

describe("JiraCollectorsService", () => {
  const jiraService: JiraService = {
    completedSprintsSince: async (
      teamId: number,
      referenceDate: Date
    ): Promise<Sprint[]> => {
      return [testSprint()];
    },

    sprintData: async (
      jiraConfig: JiraConfig,
      sprint: Sprint
    ): Promise<SprintTask[]> => {
      return [testSprintTask()];
    }
  };

  const jiraCollectorsService: JiraCollectorsService = new JiraCollectorsService(
    jiraService
  );

  it("should fetch jiraMetrics", async () => {
    const jiraCollectorConfig: JiraCollectorConfig = new JiraCollectorConfig({
      teamId: 68,
      since: "2018-11-20",
      workFlowMap: null,
      fields: null
    });

    const data = await jiraCollectorsService.fetch(jiraCollectorConfig);
    expect(data).toMatchSnapshot();
  });
});
