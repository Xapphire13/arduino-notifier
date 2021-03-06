import Logger from "./logger";
import SerialPort from "serialport";
import {ControlCode} from "./control-code";
import {write} from "./serial-port-helpers";
import {viewToString} from "./buffer-utils";

const TIMER_INFO_SIZE = 3;

export default class Notifier {
  constructor(private port: SerialPort) {}

  public async notify(): Promise<void> {
    Logger.debug("Sending notification... ");
    await write(this.port, [ControlCode.Notify]);
    Logger.debug("Sent!");
  }

  public async updateNotification(notificationId: number, flashSpeed: number): Promise<void> {
    if (notificationId > 7) throw "notificationId must be between 0-7";

    const buf = new ArrayBuffer(2 + TIMER_INFO_SIZE);
    const view = new DataView(buf);

    // Control code
    view.setUint8(0, ControlCode.UpdateTimers);
    // Number of timers
    view.setUint8(1, 1);

    // TimerInfo
    Logger.debug(`Setting NotificationID: ${notificationId} to flash speed: ${flashSpeed}`);
    view.setUint16(2, flashSpeed, true);
    view.setUint8(4, notificationId);
    Logger.debug(`Sending buffer: ${viewToString(view)}`);

    await write(this.port, Buffer.from(buf));
  }
}
