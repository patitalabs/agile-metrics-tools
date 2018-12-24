import { ExternalConfig } from "./Types";
import * as csvtojson from "csvtojson";

export class CsvReader {
  static readFromCsv(externalConfig: ExternalConfig): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {
      csvtojson({ checkType: true })
        .fromFile(externalConfig.srcPath)
        .then(
          jsonObjects => {
            resolve(jsonObjects);
          },
          reason => reject(reason)
        );
    });
  }
}
