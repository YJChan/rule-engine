export class ERRORS {
  public static FAIL_TO_PARSE = {
    code: 'C01',
    message: 'Cannot construct compare condition, please ensure comparer and comparer value is not empty'
  };
  public static INIFINITE_LOOP = {
    code: 'C02',
    message: 'Program seems run into infinite loop'
  };
  public static EMPTY_TRIGGER = {
    code: 'C03',
    message: 'There is no trigger setup'
  };
  public static ERROR_EXEC_TRIGGER = {
    code: 'C04',
    message: 'There is a problem with the trigger function'
  };
  public static NO_OPERATOR_FOUND = {
    code: 'O01',
    message: 'Cannot find operator when evaluate condition, valid operators are ==, !=, >, >=, <, <='
  };
  public static NO_CONDITION_TAG_FOUND = {
    code: 'O02',
    message: 'No condition tag found'
  };
  public static BRACKETS_NOT_MATCH = {
    code: 'O03',
    message: 'Open and close brackets do not match'
  };
  public static DUPLICATE_FOUND = {
    code: 'R01',
    message: 'Duplicate condition found!'
  };
}

export interface IErr {
  code: string,
  message: string
}

export class Err extends Error implements IErr{
  code: any;
  message: any;

  constructor(
    err: IErr
  ) {
    super(err.message);
    this.message = err?.message;
    this.code = err?.code;
  }

}