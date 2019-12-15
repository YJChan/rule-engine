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

  constructor(
  ) { }

  id(n: string) {
    this._id = n;
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
      this._conditions.push(condition);
      // Logger.debug(condition);
      return this;
    } catch (err) {
      Logger.debug(err);
      return this;
    }
  }

  expected(outcome: Outcome) {
    this._outcome = outcome; 
    return this;
  }

  verify() {
    const conditionMetTag = this._conditions.map(condition => { condition.evaluate(); return condition; })
      .filter(condition => condition._conditionMeet)
      .map(condiition => condiition._tag);
    
    if (conditionMetTag.length === this._conditions.length) {
      if (this._outcome) {
        return {outcome: this._outcome.outcome, completed: true};
      }
      return {outcome: {}, completed: true};
    }
    return {outcome: {}, completed: false};
    // return ;
    // this._outcome?.successCondition.and.forEach((s) => {
    //   if ()
    // });
  }

  findDuplicate(condition: Condition) {
    return this._conditions.filter(_c =>  _c.equal(condition)).length > 0 ? true : false;
  }
}