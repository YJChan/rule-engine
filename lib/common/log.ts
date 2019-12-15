export class Logger {
  constructor(
    public message?: any
    ) {

  }

  public static info(message: string, message2: any = null) {
    if (message2) {
      console.log(message, message2);
      return;
    }
    console.log(message);
  }

  public static debug(message: any) {
    console.log(`\x1b[35m`, message);
  }
}