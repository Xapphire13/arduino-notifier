import child_process from "child_process";
import EventEmitter from "events";

export default class OutlookNotifier {
  private outlook: child_process.ChildProcess;
  private eventEmitter: EventEmitter;

  constructor(dllPath: string) {
    this.eventEmitter = new EventEmitter();
    this.outlook = child_process.spawn("dotnet", [dllPath]);

    this.outlook.stdout.on("data", (buff: Buffer) => {
      const controlCode: ControlCode = buff.readUInt8(0);

      switch (controlCode) {
        case ControlCode.UnreadCount:
          this.eventEmitter.emit(OutlookEvent.CountChange, buff.readInt32LE(1));
          break;
        case ControlCode.Reminder:
          this.eventEmitter.emit(OutlookEvent.Reminder);
          break;
      }
    });
  }

  public on(event: "reminder", listener: () => void) : void
  public on(event: "countChange", listener: (unreadCount: number) => void) : void
  public on(event: string, listener: (...args: any[]) => void): void {
    this.eventEmitter.on(event, listener);
  }

  public dispose(): void {
    this.eventEmitter.removeAllListeners();
    this.outlook.kill();
  }
}

enum OutlookEvent {
  CountChange = "countChange",
  Reminder = "reminder"
}

enum ControlCode {
  UnreadCount = 0x01,
  Reminder = 0x02
}
