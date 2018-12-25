import { JenkinsJob } from "../Types";
import { JenkinsCollectorConfig, JenkinsMetricItem } from "./Types";
import { toHash } from "../../../metrics";

export class JenkinsMetricConverter {
  static toMetricItem(
    jenkinsJob: JenkinsJob,
    jenkinsConfig: JenkinsCollectorConfig
  ): JenkinsMetricItem[] {
    return jenkinsJob.builds.map(build => {
      return {
        id: toHash(`${jenkinsConfig.projectName}-${build.timestamp.getTime()}`),
        dataType: "CI",
        createdAt: build.timestamp,
        jenkinsUrl: build.url,
        buildName: jenkinsJob.name,
        result: build.result,
        durationInSeconds: this.msToSeconds(build.durationInMs),
        causedBy: build.causedBy,
        revision: build.revision,
        revisionDescription: build.revisionDescription,
        buildNumber: build.buildNumber,
        projectName: jenkinsConfig.projectName
      };
    });
  }

  private static msToSeconds(ms) {
    return ms / 1000;
  }
}
