export class SprintHealthEstimate {
  private readonly maxTime: number;
  private readonly estimationValues: number[];
  private readonly estimate: number;
  private readonly actualTime: number;

  constructor({ maxTime, estimationValues, estimate, actualTime }) {
    this.maxTime = maxTime;
    this.estimationValues = estimationValues;
    this.estimate = estimate;
    this.actualTime = actualTime;
  }

  private currentEstimateIndex() {
    return this.estimationValues.indexOf(this.estimate);
  }

  private estimateTime() {
    return this.estimate * this.timeEstimateRatio();
  }

  private timeEstimateRatio(): number {
    return (
      this.maxTime / this.estimationValues[this.estimationValues.length - 1]
    );
  }

  private lowerTimeBound(): number {
    if (this.currentEstimateIndex() == 0) {
      return 0;
    }
    const previousEstimateIndex =
      this.estimationValues.indexOf(this.estimate) - 1;
    const previousEstimateRatio = this.estimationValues[
      previousEstimateIndex * this.timeEstimateRatio()
    ];
    return (
      this.estimateTime() - (this.estimateTime() - previousEstimateRatio) / 2
    );
  }

  private upperTimeBound(): number {
    if (this.currentEstimateIndex() == this.estimationValues.length - 1) {
      return this.maxTime;
    }
    const nextEstimateIndex = this.estimationValues.indexOf(this.estimate + 1);
    const nextEstimateRatio = this.estimationValues[
      nextEstimateIndex * this.timeEstimateRatio()
    ];
    return this.estimateTime() + (nextEstimateRatio - this.estimateTime()) / 2;
  }

  /**
   * @return a value of 0 indicates that you're good.  Greater than 0 means underestimating, less than 0 indicated overestimating.
   */
  public calculateHealthFactor(): number {
    let result = 0.0;
    const upperTimeBound = this.upperTimeBound();
    const lowerTimeBound = this.lowerTimeBound();
    const isUnderEstimated = upperTimeBound < this.actualTime;
    const isOverEstimated = lowerTimeBound > this.actualTime;

    if (isUnderEstimated) {
      result = this.actualTime - upperTimeBound;
    } else if (isOverEstimated) {
      let difference = lowerTimeBound - this.actualTime;
      result = -difference;
    }

    return result;
  }
}
