import {
  HistoryEntry,
  HistoryItem,
  IssueDetails,
  JiraConfig,
  Sprint,
  SprintSubtask,
  SprintTask
} from "./Types";
import { Utils } from "../../metrics/sprint/Utils";

export class Converters {
  static toSubtask(issue: any): SprintSubtask {
    return {
      key: issue.key,
      statusName: issue.fields.status.name
    };
  }

  static toSprintTask(
    jiraConfig: JiraConfig,
    issue: any,
    sprint: Sprint,
    issueDetails: IssueDetails
  ): SprintTask {
    let fields = issue.fields;
    return {
      key: issue.key,
      typeName: fields.issuetype.name,
      statusName: fields.status.name,
      assignee: fields.assignee ? fields.assignee.name : null,
      epic: fields.epic ? fields.epic.name : null,
      storyPoints: this.storyPoints(jiraConfig, issue),
      sprint: sprint,
      ...issueDetails
    };
  }

  static toHistoryItem(item): HistoryItem {
    return {
      field: item.field,
      fromString: item.fromString,
      toString: item.toString
    };
  }

  static toHistoryEntry(history): HistoryEntry {
    let createdDate = new Date(history.created);
    let historyItems: HistoryItem[] = history.items.map(item => {
      return Converters.toHistoryItem(item);
    });

    return {
      created: createdDate,
      items: historyItems,
      category: historyItems.length > 0 ? historyItems[0].field : null
    };
  }

  private static storyPoints(jiraConfig: JiraConfig, issue: any): number {
    let storyPointsField = "customfield_10005";
    if (jiraConfig.fields && jiraConfig.fields.storyPoints) {
      storyPointsField = jiraConfig.fields.storyPoints;
    }
    return issue.fields[storyPointsField] || null;
  }

  static toSprint(sprintData): Sprint {
    return {
      id: sprintData.id,
      name: sprintData.name,
      isoStartDate: new Date(sprintData.startDate),
      isoEndDate: new Date(sprintData.completeDate)
    };
  }

  static createDetailsForIssue(details): IssueDetails {
    return {
      subtasks: this.issueSubtasks(details),
      histories: Utils.mapToObj(this.issueHistories(details)),
      labels: details.labels,
      created: new Date(details.fields.created),
      createdBy: details.fields.creator.name,
      resolutionDate: details.fields.resolutiondate
        ? new Date(details.fields.resolutiondate)
        : new Date(),
      projectName: details.fields.project.name,
      teamName: details.fields.customfield_10900.title,
      numberOfComments: details.fields.comment
        ? details.fields.comment.total
        : 0
    };
  }

  private static issueSubtasks(details): SprintSubtask[] {
    return details.fields.subtasks.map(item => Converters.toSubtask(item));
  }

  private static issueHistories(details): Map<string, HistoryEntry[]> {
    const entriesByCategory: Map<string, HistoryEntry[]> = new Map<
      string,
      HistoryEntry[]
    >();

    for (const history of details.changelog.histories) {
      const historyEntry = Converters.toHistoryEntry(history);
      if (historyEntry.items.length == 0) {
        continue;
      }
      let historyEntries: HistoryEntry[] = entriesByCategory.get(
        historyEntry.category
      );
      if (!historyEntries) {
        historyEntries = [];
        entriesByCategory.set(historyEntry.category, historyEntries);
      }
      historyEntries.push(historyEntry);
    }
    return entriesByCategory;
  }
}
