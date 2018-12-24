import { flatMap } from "../../metrics/Utils";

export class Utils {
  static enrichWith<T>(
    t: Array<T>,
    enrichers: Array<Function>
  ): Promise<Array<T>> {
    return new Promise((resolve, reject) => {
      const itemPromises: Array<Promise<any>> = flatMap(item => {
        return enrichers.map(enricher => enricher(item));
      }, t);

      Promise.all(itemPromises)
        .then(() => {
          resolve(t);
        })
        .catch(e => reject(e));
    });
  }

  static daysBetween(date1: Date, date2: Date): number {
    const oneDayInMillis = 1000 * 60 * 60 * 24;

    const differenceInMillis = Math.abs(date2.getTime() - date1.getTime());

    return Math.round(differenceInMillis / oneDayInMillis);
  }

  static mapToObj(theMap): any {
    const obj = {};
    theMap.forEach((v, k) => {
      obj[k] = v;
    });
    return obj;
  }
}
