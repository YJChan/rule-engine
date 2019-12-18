import { ConditionOperator } from "../constants/operator";
import { Utility } from "../common/utils";
import { Logger } from "../common/log";
import { Err, ERRORS } from "../constants/errors";

export interface ICondition {
  tag?: string | number;
  operator?: string;
  comparerValue?: any;
  comparer?: any;
  conditionMeet?: boolean;
  mandatory?: boolean;

  evaluate(): void;
}

export class Condition implements ICondition {
  public _comparer: any;
  public _comparerValue: any;
  public _operator: any;
  public _conditionMeet?: boolean;

  constructor(
    public _tag: string | number,
    public _condition: string,
    public _mandatory?: boolean  
  ) {
  }

  parseCondition(): boolean{
    try { 
      if (Utility.isEmpty(this._condition)) {
        throw new Err(ERRORS.FAIL_TO_PARSE);
      }
      let condArr: any;

      if (this._condition.includes(ConditionOperator.eq)) {
        condArr = this._condition.split(ConditionOperator.eq);
        this._operator = ConditionOperator.eq;
      } else if (this._condition.includes(ConditionOperator.neq)) {
        condArr = this._condition.split(ConditionOperator.neq);
        this._operator = ConditionOperator.neq;
      } else if (this._condition.includes(ConditionOperator.gt)) {
        condArr = this._condition.split(ConditionOperator.gt);
        this._operator = ConditionOperator.gt;
      } else if (this._condition.includes(ConditionOperator.gte)) {
        condArr = this._condition.split(ConditionOperator.gte);
        this._operator = ConditionOperator.gte;
      } else if (this._condition.includes(ConditionOperator.lt)) {
        condArr = this._condition.split(ConditionOperator.lt);
        this._operator = ConditionOperator.lt;
      } else if (this._condition.includes(ConditionOperator.lte)) {
        condArr = this._condition.split(ConditionOperator.lte);
        this._operator = ConditionOperator.lte;
      } else {
        throw new Err(ERRORS.NO_OPERATOR_FOUND);
      }
      
      this._comparer = condArr[0].toString().trim();
      this._comparerValue = condArr[1].toString().trim(); 
      return true;  
    } catch (err) {
      Logger.info(err.message);
      return false;
    }
  }

  evaluate() {
    try {
      let result: boolean;
      switch(this._operator) {
        case ConditionOperator.eq: 
          result = this._comparer === this._comparerValue? true : false;
          break;
        case ConditionOperator.neq:
          result = this._comparer != this._comparerValue? true : false;
          break;
        case ConditionOperator.gt:
          result = this._comparer > this._comparerValue? true : false;
          break;
        case ConditionOperator.gte:
          result = this._comparer >= this._comparerValue? true : false;
          break;
        case ConditionOperator.lt:
          result = this._comparer < this._comparerValue? true : false;
          break;
        case ConditionOperator.lte:
          result = this._comparer <= this._comparerValue? true : false;
          break;
        default:
          throw new Err(ERRORS.NO_OPERATOR_FOUND);
          break;
      }
      this._conditionMeet = result;
    } catch (err) {
      Logger.info(err.message);
    }
  }

  equal(condition: Condition) {
    if (this._tag === condition._tag) {
      return true;
    }
      
    if ((this._comparer === condition._comparer) && 
      (this._comparerValue === condition._comparerValue) && 
      this._operator === condition._operator) {
      return true;
    }
  
    return false;
  }

}