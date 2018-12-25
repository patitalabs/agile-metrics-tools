import { Utils } from "../Utils";
import { SprintHealthEstimate } from "./SprintHealthEstimate";

export class SprintUtils {
  static devTime(movedToDev: Date, resolutionDate: Date): number {
    let devTime = 0;
    if (movedToDev) {
      let endLeadTime = new Date();
      if (resolutionDate) {
        endLeadTime = resolutionDate;
      }
      devTime = Utils.daysBetween(movedToDev, endLeadTime);
      if (devTime == 0) {
        devTime = 1;
      }
    }
    return devTime;
  }

  static leadTime({ created, resolutionDate }): number {
    let leadTime = 0.0;
    if (created) {
      let endLeadTime = new Date();
      if (resolutionDate) {
        endLeadTime = resolutionDate;
      }
      leadTime = Utils.daysBetween(created, endLeadTime);
      if (leadTime == 0.0) {
        leadTime = 1;
      }
    }
    return leadTime;
  }

  static estimateHealth({
    estimate,
    actualTime,
    maxTime,
    estimationValues
  }): number {
    if (!estimationValues) {
      estimationValues = [1, 2, 3, 5, 8];
    }
    return new SprintHealthEstimate({
      maxTime,
      estimationValues,
      estimate,
      actualTime
    }).calculateHealthFactor();
  }

  static movedToDev(movedForwardDates: Date[]): Date {
    let movedToDev: Date = null;
    if (movedForwardDates.length > 0) {
      movedToDev = movedForwardDates.reduce((dateOne, dateTwo) => {
        return dateOne < dateTwo ? dateOne : dateTwo;
      });
    }
    return movedToDev;
  }
}
