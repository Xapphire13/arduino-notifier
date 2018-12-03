import SerialPort from "serialport";
import {write} from "./serial-port-helpers";

export default class Notifier {
  constructor(private port: SerialPort) {}

  public async notify(): Promise<void> {
    await write(this.port, [1]);
  }
}
