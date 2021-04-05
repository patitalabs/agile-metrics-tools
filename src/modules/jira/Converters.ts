import {
  HistoryEntry,
  HistoryItem,
  IssueDetails,
  JiraConfig,
  Sprint,
  Subtask,
  Task,
} from './Types';
import { Utils } from '../../metrics';

export class Converters {
  static toTask(
    jiraConfig: JiraConfig,
    issueDetailsWithChangelogResponse: any,
    sprint: Sprint,
    issueDetails: IssueDetails
  ): Task {
    const fields = issueDetailsWithChangelogResponse.fields;
    return {
      key: issueDetailsWithChangelogResponse.key,
      typeName: fields.issuetype.name,
      statusName: fields.status.name,
      assignee: fields.assignee ? fields.assignee.name : null,
      epic: fields.epic ? fields.epic.name : null,
      storyPoints: this.storyPoints(
        jiraConfig,
        issueDetailsWithChangelogResponse.fields
      ),
      sprint,
      ...issueDetails,
    };
  }

  private static storyPoints(jiraConfig: JiraConfig, fields: any): number {
    const storyPointsField =
      this.configField(jiraConfig, 'storyPoints') || 'customfield_10005';
    return fields[storyPointsField] || null;
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
      isoEndDate: new Date(sprintData.completeDate),
    };
  }

  static toIssueDetails(jiraConfig: JiraConfig, details: any): IssueDetails {
    const histories = IssueConverter.histories(details);
    return {
      subtasks: IssueConverter.subtasks(details),
      histories: Utils.mapToObj(histories),
      labels: details.labels,
      created: new Date(details.fields.created),
      createdBy: details.fields.creator.name,
      resolutionDate: IssueConverter.resolutionDate(details, histories),
      projectName: details.fields.project.name,
      teamName: jiraConfig.teamName,
      numberOfComments: IssueConverter.numberOfComments(details),
      numberOfBugs: IssueConverter.numberOfBugs(details),
    };
  }
}

class IssueConverter {
  static numberOfComments(details: any) {
    return details.fields.comment ? details.fields.comment.total : 0;
  }

  static resolutionDate(details: any, histories: Map<string, HistoryEntry[]>) {
    let dateFromStatus = new Date();

    for (const statusHistoryEntry of histories.get('status') || []) {
      for (const statusChangeDetail of statusHistoryEntry.items || []) {
        if (statusChangeDetail.toString === 'Done') {
          dateFromStatus = statusHistoryEntry.created;
        }
      }
    }

    return details.fields.resolutiondate
      ? new Date(details.fields.resolutiondate)
      : dateFromStatus;
  }

  static isBug(issue): boolean {
    return issue && issue.fields.issuetype.name === 'Bug';
  }

  static numberOfBugs(details: any): number {
    const linkedIssues: any[] = details.fields.issuelinks || [];
    const linkedBugs = linkedIssues.filter(
      (issue) =>
        IssueConverter.isBug(issue.outwardIssue) ||
        IssueConverter.isBug(issue.inwardIssue)
    );

    return linkedBugs.length;
  }

  static subtasks(details): Subtask[] {
    const fields = details.fields;
    if (!fields) {
      return [];
    }
    const subtasks = fields.subtasks || [];
    return subtasks.map((item) => IssueConverter.toSubtask(item));
  }

  static histories(details): Map<string, HistoryEntry[]> {
    const entriesByCategory: Map<string, HistoryEntry[]> = new Map<
      string,
      HistoryEntry[]
    >();

    if (!details.changelog) {
      return entriesByCategory;
    }
    for (const history of details.changelog.histories || []) {
      const historyEntry = IssueConverter.toHistoryEntry(history);
      if (historyEntry.items.length === 0) {
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
      toString: item.toString,
    };
  }

  static toHistoryEntry(history): HistoryEntry {
    const createdDate = new Date(history.created);
    const historyItems: HistoryItem[] = history.items.map((item) =>
      IssueConverter.toHistoryItem(item)
    );

    return {
      created: createdDate,
      items: historyItems,
      category: historyItems.length > 0 ? historyItems[0].field : null,
    };
  }

  static toSubtask(issue: any): Subtask {
    return {
      key: issue.key,
      statusName: issue.fields.status.name,
    };
  }
}
