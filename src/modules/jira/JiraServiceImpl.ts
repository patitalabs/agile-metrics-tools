import {
  JiraConfig,
  JiraRepository,
  JiraService,
  Sprint,
  SprintTask
} from './Types';

export class JiraServiceImpl implements JiraService {
  constructor(private jiraRepository: JiraRepository) {}

  completedSprintsSince(
    teamId: number,
    since: Date,
    until: Date
  ): Promise<Sprint[]> {
    return this.jiraRepository.completedSprints(teamId, since, until);
  }

  async sprintData(
    jiraConfig: JiraConfig,
    sprint: Sprint
  ): Promise<SprintTask[]> {
    return await this.jiraRepository.sprintData(jiraConfig, sprint);
  }
}
