import { Condition } from "./condition.model";
import { Outcome } from "./outcome.model";
import { Utility } from "../common/utils";
import { Logger } from "../common/log";
import { Err, ERRORS } from "../constants/errors";

export class Rule {
  public _id: string = '';
  public _description: string = '';
  public _priority: number = 99;
  public _conditions: Condition[] = [];
  public _outcome: Outcome | undefined;
  public _name: string = '';

  constructor(
  ) { }
  
  id(i: string) {
    this._id = i;
    return this;
  }

  name(n: string) {
    this._name = n;
    return this;
  }
  describe(d: string) {
    this._description = d;
    return this;
  }

  when(condition: Condition) {
    try {
      if (!condition.parseCondition()) {
        throw new Err(ERRORS.FAIL_TO_PARSE);
      }
      if (this.findDuplicate(condition)) {
        throw new Err(ERRORS.DUPLICATE_FOUND);
      }
      if (Utility.isEmpty(condition._mandatory)) {
        condition._mandatory = true;
      }
      this._conditions.push(condition);

      return this;
    } catch (err) {
      Logger.debug(err);
      return this;
    }
  }

  andWhen(condiiton: Condition) {
    condiiton._mandatory = true;
    return this.when(condiiton);
  }

  orWhen(condiition: Condition) {
    condiition._mandatory = false;
    return this.when(condiition);
  }

  thenReturn(outcome: Outcome) {
    this._outcome = outcome; 
    return this;
  }

  verify() {
    try {   
      const andConditionMetTag = this._conditions
        .filter(condition => {
          return condition._mandatory;
        })  
        .map(condition => { 
          condition.evaluate();
          return condition; 
        })
        .every((condition) => {
          return condition._conditionMeet;
        });    

      const orConditionMetCount = this._conditions
      .filter(condition => {
        condition._mandatory === false;
      }).length;

      if (orConditionMetCount > 0){
        if (! andConditionMetTag) {
          const orConditionMet = this._conditions
            .filter(condition => {
              condition._mandatory === false;
            }).map(condition =>  {
              condition.evaluate();
              return condition._conditionMeet;
            }).length;
        
          if (orConditionMet > 0) {
            return {outcome: this._outcome?.outcome, completed: true};
          }
        }
      } else {
        if (! andConditionMetTag) {
          return { outcome: {}, completed: false };
        } else {
          return {outcome: this._outcome?.outcome, completed: true};
        }
      }
    } catch (err) {
      Logger.debug(err);
      return {outcome: {}, completed: false};
    }
  }

  findDuplicate(condition: Condition) {
    return this._conditions.filter(_c =>  _c.equal(condition)).length > 0 ? true : false;
  }
}