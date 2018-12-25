import * as crypto from "crypto";
const INIT_VECTOR = "someSecret";

export class Utils {
  static enrichWith<T>(
    t: Array<T>,
    enrichers: Array<Function>
  ): Promise<Array<T>> {
    return new Promise((resolve, reject) => {
      const itemPromises: Array<Promise<any>> = Utils.flatMap(item => {
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

  static toBase64(theText: string): string {
    return Buffer.from(theText).toString("base64");
  }

  static toHash(theText: string): string {
    return crypto
      .createHmac("sha256", INIT_VECTOR)
      .update(theText)
      .digest("hex");
  }

  static concat(x: [], y: []) {
    return x.concat(y);
  }

  static flatMap(func, arr) {
    return arr.map(func).reduce(Utils.concat, []);
  }

  static checkEnvVar(...theVariables: string[]) {
    theVariables.forEach(theVariable => {
      if (!process.env[theVariable]) {
        throw Error(`env.${theVariable} not set!`);
      }
    });
  }
}
