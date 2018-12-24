import { JenkinsRepository } from "./JenkinsRepository";
import { JenkinsJob, JenkinsService } from "./Types";

export class JenkinsServiceImpl implements JenkinsService {
  constructor(private jenkinsRepository: JenkinsRepository) {}

  findData(
    orgName: string,
    projectName: string,
    since: Date
  ): Promise<JenkinsJob> {
    return this.jenkinsRepository.jobDetails(orgName, projectName, since);
  }
}
