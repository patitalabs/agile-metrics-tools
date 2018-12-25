import { ProjectMetrics } from "../Types";
import { SonarMetricItem } from "./Types";
import { toHash } from "../../../metrics";

export class SonarMetricConverter {
  static toMetricItem(projectMetrics: ProjectMetrics): SonarMetricItem {
    return {
      id: toHash(
        `${projectMetrics.projectName}-${projectMetrics.createdAt.getTime()}`
      ),
      dataType: "SAT",
      createdAt: projectMetrics.createdAt,
      ...projectMetrics
    };
  }
}
