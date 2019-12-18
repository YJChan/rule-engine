import { IEngineContextTrigger, EngineContextTrigger } from './trigger.context';
import { Err, ERRORS } from '../constants/errors';
import { Logger } from '../common/log';

/**
 * TODO:
 * Context should define the scenario you are trying to apply rule
 */
export interface IEngineContext {
  data: any[];
  identifier?: any;
  steps?: any;
  trigger?: IEngineContextTrigger[];

  onContextEvaluate(...params: any): any;
}

export class EngineContext implements IEngineContext {
  data: any[] = [];
  currentContext: any;
  identifier?: any;

  steps?: any;
  
  trigger: IEngineContextTrigger[] = [];
  
  constructor() {

  }

  setTrigger(engineContextTrigger: EngineContextTrigger) {
    this.trigger?.push(engineContextTrigger);
  }


  onContextEvaluate(fn: Function) {
    try {
      for (const trig of this.trigger) {
        if (this.currentContext === trig.triggerWhen) {
          // do something;
            throw new Err(ERRORS.ERROR_EXEC_TRIGGER);
            trig.fn();
          }
      }
    } catch (err) {
      Logger.debug(err);
    }
      
    try {
      fn();
    } catch (err) {
      Logger.debug(err);
    }
  }
  
}