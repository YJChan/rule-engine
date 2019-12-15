export class Utility {
  public static isUndefined(v: any) {
    return typeof v === 'undefined';
  }

  public static isNull(v: any) {
    return v === null;
  }

  public static isEmpty(v: any) {
    return this.isNull(v) || this.isUndefined(v);
  }

  public static isNotEmpty(v: any) {
    return ! this.isEmpty(v);
  }
} 