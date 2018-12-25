import { JiraModuleFactory } from "./JiraModuleFactory";

describe("JiraModuleFactory", () => {
  const jiraModuleFactory: JiraModuleFactory = new JiraModuleFactory();

  beforeEach(() => {
    jest.resetModules();
    delete process.env.JIRA_HOST;
    delete process.env.JIRA_API_TOKEN;
  });

  it("should create collector", () => {
    process.env.JIRA_HOST = "SOME_TOKEN";
    process.env.JIRA_API_TOKEN = "JIRA_API_TOKEN";
    const collectorInstance = jiraModuleFactory.collectorInstance();
    expect(collectorInstance).not.toBeNull();
  });

  it("should fail to create collector", () => {
    expect(jiraModuleFactory.collectorInstance).toThrowErrorMatchingSnapshot();
  });

  it("should create collectorConfiguration", () => {
    const collectorConfiguration = jiraModuleFactory.collectorConfiguration({});
    expect(collectorConfiguration).not.toBeNull();
  });
});
