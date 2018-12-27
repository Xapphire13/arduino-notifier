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

  public log(message: any, noNewline: boolean = false): void {
    if (noNewline) {
      process.stdout.write(message);
    } else {
      console.log(message);
    }
  }

  public error(message: any): void {
    console.error(message);
  }

  public ok(message: any): void {
    console.log(chalk.green(`${message}`));
  }
}

export default new Logger();
