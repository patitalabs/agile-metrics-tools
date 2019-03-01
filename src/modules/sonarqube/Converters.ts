import { ProjectMetrics, SonarConfig } from './Types';

export class Converters {
  static toProjectMetrics(
    measuresResponse: any,
    analysisHistoryResponse: string,
    sonarConfig: SonarConfig
  ): ProjectMetrics[] {
    const measureMapsPerDate = this.measureMapPerDate(measuresResponse);
    const analysisMapsPerDate = this.analysisMapPerDate(
      analysisHistoryResponse
    );
    const result = [];

    for (const dateStr of measureMapsPerDate.keys()) {
      const measureMapForDate = measureMapsPerDate.get(dateStr);
      const version = analysisMapsPerDate.get(dateStr);

      const projectMetrics = this.toProjectMetric({
        sonarConfig,
        measureMapForDate,
        dateStr,
        version
      });
      result.push(projectMetrics);
    }
    return result;
  }

  private static measureMapPerDate(
    measuresResponse
  ): Map<string, Map<string, string>> {
    const { measures = [] } = measuresResponse;

    const measureMapsPerDate = new Map<string, Map<string, string>>();

    for (const measure of measures) {
      for (const historyEntry of measure.history) {
        let metricMapForDate = measureMapsPerDate.get(historyEntry.date);
        if (!metricMapForDate) {
          metricMapForDate = new Map<string, string>();
          measureMapsPerDate.set(historyEntry.date, metricMapForDate);
        }
        metricMapForDate.set(measure.metric, historyEntry.value);
      }
    }
    return measureMapsPerDate;
  }

  private static toProjectMetric({
    sonarConfig,
    measureMapForDate,
    dateStr,
    version
  }: {
    sonarConfig: SonarConfig;
    measureMapForDate: Map<string, string>;
    dateStr: string;
    version: string;
  }): ProjectMetrics {
    return {
      createdAt: new Date(dateStr),
      teamName: sonarConfig.teamName,
      projectName: sonarConfig.projectName,
      alertStatus: this.stringValue(measureMapForDate, 'alert_status'),
      qualityGateDetails: this.stringValue(
        measureMapForDate,
        'quality_gate_details'
      ),
      bugs: this.numberValue(measureMapForDate, 'bugs'),
      newBugs: this.numberValue(measureMapForDate, 'new_bugs'),
      reliabilityRating: this.numberValue(
        measureMapForDate,
        'reliability_rating'
      ),
      newReliabilityRating: this.numberValue(
        measureMapForDate,
        'new_reliability_rating'
      ),
      vulnerabilities: this.numberValue(measureMapForDate, 'vulnerabilities'),
      newVulnerabilities: this.numberValue(
        measureMapForDate,
        'new_vulnerabilities'
      ),
      securityRating: this.numberValue(measureMapForDate, 'security_rating'),
      newSecurityRating: this.numberValue(
        measureMapForDate,
        'new_security_rating'
      ),
      codeSmells: this.numberValue(measureMapForDate, 'code_smells'),
      newCodeSmells: this.numberValue(measureMapForDate, 'new_code_smells'),
      sqaleRating: this.numberValue(measureMapForDate, 'sqale_rating'),
      newMaintainabilityRating: this.numberValue(
        measureMapForDate,
        'new_maintainability_rating'
      ),
      sqaleIndex: this.numberValue(measureMapForDate, 'sqale_index'),
      newTechnicalDebt: this.stringValue(
        measureMapForDate,
        'new_technical_debt'
      ),
      coverage: this.numberValue(measureMapForDate, 'coverage'),
      newCoverage: this.numberValue(measureMapForDate, 'new_coverage'),
      newLinesToCover: this.numberValue(
        measureMapForDate,
        'new_lines_to_cover'
      ),
      tests: this.numberValue(measureMapForDate, 'tests'),
      duplicatedLinesDensity: this.numberValue(
        measureMapForDate,
        'duplicated_lines_density'
      ),
      newDuplicatedLinesDensity: this.numberValue(
        measureMapForDate,
        'new_duplicated_lines_density'
      ),
      duplicatedBlocks: this.numberValue(
        measureMapForDate,
        'duplicated_blocks'
      ),
      ncloc: this.numberValue(measureMapForDate, 'ncloc'),
      nclocLanguageDistribution: this.stringValue(
        measureMapForDate,
        'ncloc_language_distribution'
      ),
      newLines: this.numberValue(measureMapForDate, 'new_lines'),
      version
    };
  }

  private static numberValue(measureMap, key) {
    return Number(measureMap.get(key)) || 0;
  }

  private static stringValue(measureMap, key) {
    return measureMap.get(key) || '';
  }

  private static analysisMapPerDate(
    analysisHistoryResponse: any
  ): Map<string, string> {
    const analysisMap: Map<string, string> = new Map<string, string>();

    for (const analysis of analysisHistoryResponse.analyses || []) {
      const versions =
        analysis.events
          .filter(event => event.category === 'VERSION')
          .map(event => event.name) || [];

      if (versions.length > 0) {
        analysisMap.set(analysis.date, versions[0]);
      }
    }

    return analysisMap;
  }
}
