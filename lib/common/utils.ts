import * as util from 'util';

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

  public static isPositive(v: number) {
    return v >= 0;  
  }

  public static isNegative(v: number) {
    return v < 0;
  }

  public static id(num = 36) {
    return Math.random().toString(num).substr(2, 9);
  }

  public static isAsyncFn(fn: any) {
    return util.types.isAsyncFunction(fn);
  }
}