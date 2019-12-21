import { Rule } from "./rule.model";

export interface IRuleEvalParam {
  comparer?: any;
  comparerValue?: any
  inputCondition?: any;
  compareCondition?: any;
  ruleId?: any;
  rule?: Rule;
  identifier: string;
}