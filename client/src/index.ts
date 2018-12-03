import SerialPort from "serialport";
import Notifier from "./notifier";

// TODO, search list of arduino boards (https://github.com/arduino/ArduinoCore-avr/blob/master/boards.txt)
const VID = "2341";
const PID = "0043";

async function main(): Promise<void> {
  const availableDevices = await SerialPort.list();

  const arduinoUnoInfo = availableDevices.find(info => info.vendorId === VID && info.productId === PID);

  if (arduinoUnoInfo) {
    var port = new SerialPort(arduinoUnoInfo.comName);
    const parser = port.pipe(new SerialPort.parsers.Ready({delimiter: "READY"}));
    parser.on("ready", () => onNotifierReader(new Notifier(port)));
  } else {
    console.log("No device detected, is it plugged in?");
    return;
  }
}

async function onNotifierReader(device: Notifier): Promise<void> {
  await device.notify();
  process.exit(0);
}

main();
