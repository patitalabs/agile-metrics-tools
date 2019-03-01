import { SprintUtils } from './SprintUtils';

describe('SprintUtils', () => {
  it('devTime', () => {
    const devTime = SprintUtils.devTime(
      new Date('2018-12-04'),
      new Date('2018-12-14')
    );
    expect(devTime).toBe(10);
  });

  it('leadTime', () => {
    const leadTime = SprintUtils.leadTime({
      created: new Date('2018-12-02'),
      resolutionDate: new Date('2018-12-12')
    });
    expect(leadTime).toBe(10);
  });

  it('movedToDev', () => {
    const movedToDev = SprintUtils.movedToDev([
      new Date('2018-12-03'),
      new Date('2018-12-13')
    ]);
    expect(movedToDev).toMatchSnapshot();
  });

  it('estimateHealth underEstimate', () => {
    const estimateHealth = SprintUtils.estimateHealth({
      estimate: 2,
      actualTime: 6,
      maxTime: 8,
      estimationValues: [1, 2, 3, 5, 8]
    });
    expect(estimateHealth).toBe(3.5);
  });

  it('estimateHealth exact estimate', () => {
    const estimateHealth = SprintUtils.estimateHealth({
      estimate: 5,
      actualTime: 5,
      maxTime: 13,
      estimationValues: [1, 2, 3, 5, 8, 13]
    });
    expect(estimateHealth).toBe(0);
  });

  it('estimateHealth oveEstimate', () => {
    const estimateHealth = SprintUtils.estimateHealth({
      estimate: 5,
      actualTime: 1,
      maxTime: 8,
      estimationValues: [1, 2, 3, 5, 8]
    });
    expect(estimateHealth).toBe(-3);
  });

  it('estimateHealth underEstimate no estimate', () => {
    const estimateHealth = SprintUtils.estimateHealth({
      estimate: 1,
      actualTime: 6,
      maxTime: 3,
      estimationValues: [1]
    });
    expect(estimateHealth).toBe(3);
  });

  it('estimateHealth exact estimate no estimate', () => {
    const estimateHealth = SprintUtils.estimateHealth({
      estimate: 1,
      actualTime: 1,
      maxTime: 14,
      estimationValues: [1]
    });
    expect(estimateHealth).toBe(0);
  });

  it('estimateHealth oveEstimate no estimate', () => {
    const estimateHealth = SprintUtils.estimateHealth({
      estimate: 1,
      actualTime: 0,
      maxTime: 14,
      estimationValues: [1]
    });
    expect(estimateHealth).toBe(-1);
  });
});
