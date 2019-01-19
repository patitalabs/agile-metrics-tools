import {
  JenkinsBuild,
  JenkinsClient,
  JenkinsJob,
  JenkinsRepository
} from './Types';
import { Converters } from './Converters';

export class JenkinsRepositoryImpl implements JenkinsRepository {
  constructor(private jenkinsClient: JenkinsClient) {}

  async jobDetails(
    orgName: string,
    projectName,
    since: Date
  ): Promise<JenkinsJob> {
    const jobDetails = await this.jenkinsClient.getData(
      `job/${orgName}/job/${projectName}/job/master/`
    );

    const buildsPromises: Promise<JenkinsBuild>[] = jobDetails.builds.map(
      jobBuild => {
        return this.buildDetails(orgName, projectName, jobBuild.number);
      }
    );

    const builds = await Promise.all(buildsPromises);
    const filteredBuilds = builds.filter(jobBuild => {
      return new Date(jobBuild.timestamp) >= since;
    });
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
