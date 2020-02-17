import { Rule } from "./model/rule.model";
import { EngineContext, IEngineContext } from './context/context';
import { Utility } from "./common/utils";
import { Err, ERRORS } from "./constants/errors";
import { Logger } from "./common/log";
import { IRuleEvalParam } from "./model/parameter.model";
import { Outcome } from "./model/outcome.model";

interface IContextMap {
  [key: string]: EngineContext;
}

export interface IEngine {
  rules: Rule[];
  context: IContextMap;
  useContext: boolean;

  onStart(...params: any): any;
  onEvaluate(fn: Function): any;
  onEnd(...params: any): any;
  process(params: IRuleEvalParam): any;
  setRules(rules: Rule[]): void;
  getRules(): Rule[];
  setContext(context: IEngineContext): void;
  getContext(id: string | number): IEngineContext | undefined;
  addRule(rule: Rule): void;
  removeRule(ruleId: string | number): boolean;
  getRule(ruleId: string | number): Rule | undefined;
  editRule(rule: Rule): Rule | undefined;
}

export class RuleEngine implements IEngine {
  rules: Rule[];
  context: IContextMap;
  public useContext: boolean;
  currentContext: any;

  constructor(useContext: boolean = true) {
    this.rules = [];
    this.context = {};
    this.useContext = useContext;
  }

  public setRules(rules: Rule[]): void {
    this.rules = rules;
  }

  public getRules(): Rule[] {
    return this.rules;
  }

  public setContext(context: EngineContext): void {
    this.context[context.id] = context;
  }

  public getContext(id: string | number): IEngineContext {
    const engineContext: IEngineContext = this.context[id];
    return engineContext;
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
  
  public onEvaluate(fn: Function) {
    try {
      fn();
    } catch (err) {
      Logger.debug(err);
    }
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
        if (Utility.isEmpty(this.currentContext)) {
          throw new Err(ERRORS.EMPTY_CONTEXT);
        }
        this.context[this.currentContext].onPreTrigger();
        
        const ruleAppliedOnCurrContext = this.rules.filter(r => r._contextIdentifier === this.currentContext);
        for (const rule of ruleAppliedOnCurrContext) {
          rule._conditions.forEach(condition => {
            condition._comparer = this.context[this.currentContext].getData(condition._comparer);
          });

          this.context[this.currentContext].onEvaluate();
          outcome = rule.verify();
          if (outcome?.passed) {
            break;
          }
        }

        this.context[this.currentContext].onPostTrigger();

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

  public setJsonRules(jsonStr: JSON | string) {
    
  }
}