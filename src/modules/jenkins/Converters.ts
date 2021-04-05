import { JenkinsBuild, JenkinsJob } from './Types';
import { Utils } from '../../metrics';

export class Converters {
  static toJenkinsJob(jobDetails, builds): JenkinsJob {
    return {
      name: jobDetails.fullName,
      branch: jobDetails.name,
      builds,
    };
  }

  static toJenkinsBuild(jobDetails: any): JenkinsBuild {
    const causedBy = this.causedBy(jobDetails);

    const commitDetails: CommitDetails = this.commitDetails(jobDetails);

    return {
      timestamp: new Date(jobDetails.timestamp),
      result: jobDetails.result,
      durationInMs: jobDetails.duration,
      causedBy,
      revision: commitDetails.revision,
      revisionDescription: commitDetails.revisionDescription,
      buildNumber: jobDetails.number,
      url: jobDetails.url,
    };
  }

  private static causedBy(jobDetails): string {
    const jenkinsCulprits = jobDetails.culprits || [];
    const culprits = jenkinsCulprits.map((culprit) => culprit.fullName);
    return culprits.join('; ');
  }

  private static commitDetails(jobDetails): CommitDetails {
    const changeSetDetails = Utils.flatMap(
      (changeSet) => changeSet.items,
      jobDetails.changeSets || []
    );
    let revision = '';
    let revisionDescription = '';
    if (changeSetDetails.length > 0) {
      const firstChangeSet = changeSetDetails[0];
      revision = firstChangeSet.commitId;
      revisionDescription = firstChangeSet.msg;
    }
    return {
      revision,
      revisionDescription,
    };
  }
}

interface CommitDetails {
  revision: string;
  revisionDescription: string;
}
