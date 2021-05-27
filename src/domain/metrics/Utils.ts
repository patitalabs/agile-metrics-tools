import * as crypto from 'crypto';

export class Utils {
  static toHash(theText: string): string {
    return crypto.createHash('sha512').update(theText).digest('hex');
  }

  static isDateInRange({
    createdAt,
    since,
    until,
  }: {
    createdAt: Date;
    since: Date;
    until?: Date;
  }): boolean {
    let isInRangeFromEnd = true;
    if (until) {
      isInRangeFromEnd = createdAt <= until;
    }
    const isInRangeFromStart = createdAt >= since;
    return isInRangeFromStart && isInRangeFromEnd;
  }
}
