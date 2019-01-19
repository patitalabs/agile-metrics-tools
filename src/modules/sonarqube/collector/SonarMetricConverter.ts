import { ProjectMetrics } from '../Types';
import { SonarMetricItem } from './Types';
import { Utils } from '../../../metrics';

export class SonarMetricConverter {
  static toMetricItem(projectMetrics: ProjectMetrics): SonarMetricItem {
    return {
      id: Utils.toHash(
        `${projectMetrics.projectName}-${projectMetrics.createdAt.getTime()}`
      ),
      dataType: 'SAT',
      createdAt: projectMetrics.createdAt,
      ...projectMetrics
    };
  }
}
