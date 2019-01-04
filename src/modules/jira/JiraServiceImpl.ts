import {
  IssueDetails,
  JiraConfig,
  JiraRepository,
  JiraService,
  Sprint,
  SprintTask
} from "./Types";

export class JiraServiceImpl implements JiraService {
  constructor(private jiraRepository: JiraRepository) {}

  completedSprintsSince(
    teamId: number,
    referenceDate: Date
  ): Promise<Sprint[]> {
    return this.jiraRepository.completedSprintsSince(teamId, referenceDate);
  }

  async sprintData(
    jiraConfig: JiraConfig,
    sprint: Sprint
  ): Promise<SprintTask[]> {
    return await this.jiraRepository.sprintData(jiraConfig, sprint);
  }

  issueDetails(issueId: string): Promise<IssueDetails> {
    return this.jiraRepository.issueDetailsWithChangelog(issueId);
  }
}
