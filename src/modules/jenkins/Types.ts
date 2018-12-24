export class JenkinsJob {
  name: string;
  branch: string;
  builds: JenkinsBuild[];
}

export class JenkinsBuild {
  timestamp: Date;
  result: string;
  durationInMs: number;
  causedBy: string;
  revision: string;
  revisionDescription: string;
  buildNumber: string;
  url: string;
}

export interface JenkinsService {
  findData(
    orgName: string,
    projectName: string,
    since: Date
  ): Promise<JenkinsJob>;
}

export interface JenkinsClient {
  getData(url): Promise<any>;
}
