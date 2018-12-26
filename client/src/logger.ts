import chalk from "chalk";

class Logger {
  private isDebug: boolean;

  constructor() {
    this.isDebug = process.env.NODE_ENV === "dev";
  }

  public debug(message: string): void {
    if (this.isDebug) {
      console.log(`${chalk.bgYellow.black("DEBUG")} ${chalk.yellow(message)}`);
    }
  }

  public log(message: string): void {
    console.log(message);
  }
}

export default new Logger();
