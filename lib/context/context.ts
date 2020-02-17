import { IEngineContextTrigger, EngineContextTrigger, PrePost } from './trigger.context';
import { Err, ERRORS } from '../constants/errors';
import { Logger } from '../common/log';
import { Utility } from '../common/utils';

/**
 * TODO:
 * Context should define the scenario you are trying to apply rule
 */
export interface IEngineContext {
  id: string | number;
  data: any;
  steps?: any;
  trigger?: IEngineContextTrigger[];
  onEvalFn?: Function;

  setOnEvalFn(fn: Function): void;
}

export class EngineContext implements IEngineContext {
  data: any;

  steps?: any;
  
  trigger: IEngineContextTrigger[] = [];
  onEvalFn: Function = Function();

  constructor(
    public id: string | number,
  ) {
  }

  public setData(d: any): void {
    this.data = d;
  }

  public getData(identifier: string) {
    if (identifier.indexOf('.') > -1) {
      const identifierArr = identifier.split('.');
      if (identifierArr.length === 2) {
        return this.data[identifierArr[0]][identifierArr[1]];
      }
    } else {
      return this.data[identifier];
    }
  }

  public setTrigger(engineContextTrigger: EngineContextTrigger) {
    this.trigger?.push(engineContextTrigger);
  }

  public setOnEvalFn(fn: Function) {
    this.onEvalFn = fn;
  }

  onPreTrigger() {
    if (this.trigger.length === 0) {
      //Logger.debug(ERRORS.EMPTY_TRIGGER);
      return;
    }
    try {
      for (const trig of this.trigger) {
        if (trig.prePost === PrePost.PRE) {
          trig.contextData = this.data;
          trig.fn();
          // break;
        }
      }

    } catch (err) {
      Logger.debug(err);
      throw new Err(ERRORS.ERROR_EXEC_TRIGGER);
    }
  }

  onPostTrigger() {
    if (this.trigger.length === 0) {
      // Logger.debug(ERRORS.EMPTY_TRIGGER);
      return;
    }
    try {
      for (const trig of this.trigger) {
        if (trig.prePost === PrePost.POST) {
          trig.contextData = this.data;
          trig.fn(trig);
          // break;
        }
      }
    } catch (err) {
      Logger.debug(err);
      throw new Err(ERRORS.ERROR_EXEC_TRIGGER);
    }
  }

  public onEvaluate() {
    try {
      this.onEvalFn(this.data);
    } catch (err) {
      Logger.debug(err);
    }
  }
}
