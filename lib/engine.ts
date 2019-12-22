import { Rule } from "./model/rule.model";
import { EngineContext, IEngineContext } from './context/context';
import { Utility } from "./common/utils";
import { Err, ERRORS } from "./constants/errors";
import { Logger } from "./common/log";
import { IRuleEvalParam } from "./model/parameter.model";
import { Outcome } from "./model/outcome.model";

export interface IEngine {
  rules: Rule[];
  context: EngineContext;
  useContext: boolean;

  onStart(...params: any): any;
  onEvaluate(): void;
  onEnd(...params: any): any;
  process(params: IRuleEvalParam): any;
  setRules(rules: Rule[]): void;
  getRules(): Rule[];
  setContext(context: IEngineContext): void;
  getContext(): IEngineContext | undefined;
  addRule(rule: Rule): void;
  removeRule(ruleId: string | number): boolean;
  getRule(ruleId: string | number): Rule | undefined;
  editRule(rule: Rule): Rule | undefined;
}

export class RuleEngine implements IEngine {
  rules: Rule[];
  context: EngineContext;
  public useContext: boolean;

  constructor(useContext: boolean = true) {
    this.rules = [];
    this.context = new EngineContext();
    this.useContext = useContext;
  }

  public setRules(rules: Rule[]): void {
    this.rules = rules;
  }
  public getRules(): Rule[] {
    return this.rules;
  }
  public setContext(context: EngineContext): void {
    this.context = context;
  }
  public getContext(): IEngineContext {
    return this.context;
  }
  public addRule(rule: Rule): void {
    if (Utility.isEmpty(this.rules)) {
      throw new Err(ERRORS.EMPTY_RULES);
    }
    this.rules.push(rule);
  }
  public removeRule(ruleId: string | number): boolean {
    try {
      if (Utility.isEmpty(this.rules)) {
        throw new Err(ERRORS.EMPTY_RULES);
      }
      const index = this.rules.findIndex(rule => rule._id === ruleId);
      if (Utility.isNegative(index)) {
        throw new Err(ERRORS.NOT_FOUND_IN_ARRAY);
      }

      this.rules.slice(index, 1);
      return true;
    } catch(err) {
      Logger.debug(err);
      return false;
    }

  }
  public getRule(ruleId: string | number): Rule | undefined {
    try {
      const index = this.rules?.findIndex(rule => {
        return rule._id === ruleId;
      });
      return this.rules[index];
    } catch(err) {
      Logger.debug(err);
      return undefined;
    }
  }
  public editRule(r: Rule): Rule | undefined{
    try {
      const index = this.rules?.findIndex(rule => {
        return rule._id === r._id;
      });
      let rule = this.rules[index];
      if (Utility.isEmpty(rule)) {
        throw new Err(ERRORS.NOT_FOUND_IN_ARRAY);
      }
      rule?.name(r._name);
      rule?.describe(r._description);
      rule._conditions = r._conditions;
      rule._outcome = r._outcome;
      rule._priority = r._priority;
      this.rules[index] = rule;
      return this.rules[index];
    } catch (err) {
      Logger.debug(err);
      return undefined;
    }
  }

  public onStart(...params: any) {
    
  }
  
  public onEvaluate(): void {
    
  }
  
  public onEnd(...params: any) {
    
  }
  
  public process(): any {
    let outcome;
    try {
      this.onStart();
      
      if (this.rules.length === 0) {
        throw new Err(ERRORS.EMPTY_RULES);
      }

      if (this.useContext) {
        if (Utility.isEmpty(this.context)) {
          throw new Err(ERRORS.EMPTY_CONTEXT);
        }

        for (const rule of this.rules) {
          if (rule._contextIdentifier === this.context.currentContext) {
            rule._conditions.forEach(condition => {
              condition._comparer = this.context.getData(condition._comparer);
            });
            // Logger.debug(rule._conditions);
            this.context.onTrigger();
            outcome = rule.verify();
            if (outcome?.passed) {
              break;
            }
          }
        }

        return outcome; 
      } else {

      }
      
      this.onEnd();
    } catch(err) {
      Logger.debug(err);
      return Outcome.EMPTY_OUTCOME();
    }
  }

  public test() {

  }
}