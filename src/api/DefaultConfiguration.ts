import { Utils } from '../metrics';
import { TeamMetricsRequestByTeam } from '../Types';

export class DefaultConfiguration {
  static async of(
    teamMetricsRequestByTeam: TeamMetricsRequestByTeam,
    defaultReferenceDate: Date
  ): Promise<any[]> {
    const configs = [];
    const templateAppConfig = await import(
      `./template-configs/app-config.json`
    );
    for (const moduleConfig of templateAppConfig.modules) {
      const file = `./template-configs/${teamMetricsRequestByTeam.teamName}/${moduleConfig.configFile}`;
      const serviceEntries = await import(`${file}`);
      for (const serviceEntry of serviceEntries) {
        const sinceDate = teamMetricsRequestByTeam.since
          ? new Date(teamMetricsRequestByTeam.since)
          : defaultReferenceDate;
        serviceEntry.teamName = teamMetricsRequestByTeam.teamName;
        serviceEntry.since = Utils.formatDate(sinceDate);
        serviceEntry.until = teamMetricsRequestByTeam.until
          ? Utils.formatDate(new Date(teamMetricsRequestByTeam.until))
          : null;
      }
      configs.push({
        ...teamMetricsRequestByTeam,
        config: serviceEntries,
        serviceName: moduleConfig.type,
      });
    }

    return configs;
  }
}
