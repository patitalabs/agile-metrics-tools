import {
  JenkinsBuild,
  JenkinsClient,
  JenkinsJob,
  JenkinsRepository,
} from './Types';
import { Converters } from './Converters';
import { Utils } from '../../metrics';

export class JenkinsRepositoryImpl implements JenkinsRepository {
  constructor(private readonly jenkinsClient: JenkinsClient) {}

  async jobDetails(
    orgName: string,
    projectName,
    since: Date,
    until?: Date
  ): Promise<JenkinsJob> {
    const jobDetails = await this.jenkinsClient.getData(
      `job/${orgName}/job/${projectName}/job/master`
    );

    const buildsPromises: Promise<JenkinsBuild>[] = jobDetails.builds.map(
      (jobBuild) => this.buildDetails(orgName, projectName, jobBuild.number)
    );

    const builds = await Promise.all(buildsPromises);
    const filteredBuilds = builds.filter((jobBuild) =>
      Utils.isDateInRange({
        createdAt: jobBuild.timestamp,
        since,
        until,
      })
    );
    return Converters.toJenkinsJob(jobDetails, filteredBuilds);
  }

  private async buildDetails(
    orgName: string,
    projectName: string,
    buildNumber: number
  ): Promise<JenkinsBuild> {
    const jobDetails = await this.jenkinsClient.getData(
      `job/${orgName}/job/${projectName}/job/master/${buildNumber}`
    );

    return Converters.toJenkinsBuild(jobDetails);
  }
}
