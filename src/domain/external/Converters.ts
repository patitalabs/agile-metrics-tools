import { ExternalData } from './Types';

export class Converters {
  static toExternalData(jsonObj: any): ExternalData {
    jsonObj.createdAt = jsonObj.createdAt
      ? new Date(jsonObj.createdAt)
      : new Date();

    return {
      ...jsonObj,
    };
  }
}
