import { Rule } from "./model/rule.model";
import { EngineContext } from './context/context';

export interface IEngine {
  rules: Rule[];
  context: EngineContext;

  onStart(...params: any): any;
  onEvaluate(): void;
  onEnd(...params: any): any;
  process(): any;
}

export class RuleEngine implements IEngine {
  rules: Rule[];  context: EngineContext;

  onStart(...params: any) {
    throw new Error("Method not implemented.");
  }
  
  onEvaluate(): void {
    throw new Error("Method not implemented.");
  }
  
  onEnd(...params: any) {
    throw new Error("Method not implemented.");
  }
  
  process() {
    throw new Error("Method not implemented.");
  }


}