import chalk from "chalk";

class Logger {
  private isDebug: boolean;

  constructor() {
    this.isDebug = process.env.NODE_ENV === "dev";
  }

  public debug(message: any): void {
    if (this.isDebug) {
      if (typeof(message) === "string") message = chalk.yellow(message);
      console.log(`${chalk.bgYellow.black("DEBUG")} ${message}`);
    }
  }

  public log(message: any): void {
    console.log(message);
  }

  public error(message: any): void {
    console.error(message);
  }
}

export default new Logger();
