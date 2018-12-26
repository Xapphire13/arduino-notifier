class Logger {
  private isDebug: boolean;

  constructor() {
    this.isDebug = process.env.NODE_ENV === "dev";
  }

  public debug(message: string): void {
    if (this.isDebug) {
      console.log(message);
    }
  }

  public log(message: string): void {
    console.log(message);
  }
}

export default new Logger();
