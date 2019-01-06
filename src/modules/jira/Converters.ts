import {
  HistoryEntry,
  HistoryItem,
  IssueDetails,
  JiraConfig,
  Sprint,
  SprintSubtask,
  SprintTask
} from "./Types";
import { Utils } from "../../metrics";

export class Converters {
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

  private static storyPoints(jiraConfig: JiraConfig, issue: any): number {
    const storyPointsField =
      this.configField(jiraConfig, "storyPoints") || "customfield_10005";
    return issue.fields[storyPointsField] || null;
  }

  static configField(jiraConfig: JiraConfig, nameOfField: string) {
    if (jiraConfig.fields && jiraConfig.fields[nameOfField]) {
      return jiraConfig.fields[nameOfField];
    }
    return null;
  }

  static toSprint(sprintData): Sprint {
    return {
      id: sprintData.id,
      name: sprintData.name,
      isoStartDate: new Date(sprintData.startDate),
      isoEndDate: new Date(sprintData.completeDate)
    };
  }

  static toIssueDetails(jiraConfig: JiraConfig, details: any): IssueDetails {
    return {
      subtasks: IssueConverter.subtasks(details),
      histories: Utils.mapToObj(IssueConverter.histories(details)),
      labels: details.labels,
      created: new Date(details.fields.created),
      createdBy: details.fields.creator.name,
      resolutionDate: IssueConverter.resolutionDate(details),
      projectName: details.fields.project.name,
      teamName: IssueConverter.teamName(jiraConfig, details),
      numberOfComments: IssueConverter.numberOfComments(details),
      numberOfBugs: IssueConverter.numberOfBugs(details)
    };
  }
}

class IssueConverter {
  static teamName(jiraConfig: JiraConfig, details: any) {
    let teamNameField =
      Converters.configField(jiraConfig, "teamName") || "customfield_10900";

    const field = details.fields[teamNameField] || [];
    return field.title || null;
  }

  static numberOfComments(details: any) {
    return details.fields.comment ? details.fields.comment.total : 0;
  }

  static resolutionDate(details: any) {
    return details.fields.resolutiondate
      ? new Date(details.fields.resolutiondate)
      : new Date();
  }

  static numberOfBugs(details: any): number {
    const linkedIssues: any[] = details.fields.issuelinks || [];
    const linkedBugs = linkedIssues.filter(
      issue => issue.outwardIssue.fields.issuetype.name === "Bug"
    );
    return linkedBugs.length;
  }

  static subtasks(details): SprintSubtask[] {
    return details.fields.subtasks.map(item => IssueConverter.toSubtask(item));
  }

  static histories(details): Map<string, HistoryEntry[]> {
    const entriesByCategory: Map<string, HistoryEntry[]> = new Map<
      string,
      HistoryEntry[]
    >();

    for (const history of details.changelog.histories) {
      const historyEntry = IssueConverter.toHistoryEntry(history);
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

  static toHistoryItem(item: any): HistoryItem {
    return {
      field: item.field,
      fromString: item.fromString,
      toString: item.toString
    };
  }

  static toHistoryEntry(history): HistoryEntry {
    let createdDate = new Date(history.created);
    let historyItems: HistoryItem[] = history.items.map(item => {
      return IssueConverter.toHistoryItem(item);
    });

    return {
      created: createdDate,
      items: historyItems,
      category: historyItems.length > 0 ? historyItems[0].field : null
    };
  }

  static toSubtask(issue: any): SprintSubtask {
    return {
      key: issue.key,
      statusName: issue.fields.status.name
    };
  }
}
