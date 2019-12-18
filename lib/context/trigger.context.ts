export interface IEngineContextTrigger {
  id: string | number;
  triggerWhen: any;
  fn: Function;
}

export class EngineContextTrigger implements IEngineContextTrigger {

  constructor(
    public id: string | number,
    public triggerWhen: any,
    public fn: Function
  ) {

  }
  

}