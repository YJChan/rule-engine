import { IEngineContextTrigger, EngineContextTrigger } from './trigger.context';
import { Err, ERRORS } from '../constants/errors';
import { Logger } from '../common/log';
import { Utility } from '../common/utils';

/**
 * TODO:
 * Context should define the scenario you are trying to apply rule
 */
export interface IEngineContext {
  data: any;
  steps?: any;
  trigger?: IEngineContextTrigger[];

  onEvaluate(...params: any): any;
}

export class EngineContext implements IEngineContext {
  data: any;
  currentContext: any;

  steps?: any;
  
  trigger: IEngineContextTrigger[] = [];
  
  constructor() {

  }

  setData(d: any): void {
    this.data = d;
  }

  getData(identifier: string) {
    if (identifier.includes('.')) {
      const identifierArr = identifier.split('.');
      if (identifierArr.length === 2) {
        return this.data[identifierArr[0]][identifierArr[1]];
      }
    } else {
      return this.data[identifier];
    }
  }

  setTrigger(engineContextTrigger: EngineContextTrigger) {
    this.trigger?.push(engineContextTrigger);
  }

  onTrigger() {
    if (this.trigger.length === 0) {
      Logger.debug(ERRORS.EMPTY_TRIGGER);
    }
    try {
      for (const trig of this.trigger) {
        trig.fn();
      }
    } catch (err) {
      Logger.debug(err);
      throw new Err(ERRORS.ERROR_EXEC_TRIGGER);
    }
  }

  onEvaluate(fn: Function) {
    try {
        fn();
    } catch (err) {
      Logger.debug(err);
    }
  }
}
