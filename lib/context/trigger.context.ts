import { Utility } from "../common/utils";

export interface IEngineContextTrigger {
  id?: string | number;
  triggerWhen: any;
  fn: Function;
  prePost: PrePost;
  contextData?: any;
}

export enum PrePost {
  PRE, POST
};

export class EngineContextTrigger implements IEngineContextTrigger {
  
  constructor(
    public triggerWhen: any,
    public prePost: PrePost,
    public fn: Function,
    public id?: string | number,
    public contextData: any = null
  ) {
    if (id) {
      this.id = id;
    } else {
      this.id = Utility.id();
    }
  }

}