import SerialPort from "serialport";
import {write} from "./serial-port-helpers";

const TIMER_INFO_SIZE = 3;

export default class Notifier {
  constructor(private port: SerialPort) {}

  public async notify(): Promise<void> {
    await write(this.port, [1]);
  }

  public async updateNotification(notificationId: number, flashSpeed: number): Promise<void> {
    if (notificationId > 7) throw "notificationId must be between 0-7";

    const buf = new ArrayBuffer(2 + TIMER_INFO_SIZE);
    const view = new DataView(buf);

    // Control code
    view.setUint8(0, 2);
    // Number of timers
    view.setUint8(1, 1);

    // TimerInfo
    view.setUint16(2, flashSpeed, true);
    view.setUint8(4, notificationId);

    await write(this.port, Buffer.from(buf));
  }
}
