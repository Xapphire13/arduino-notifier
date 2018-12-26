import SerialPort from "serialport";
import Notifier from "./notifier";
import chalk from "chalk";
import delay from "delay";

// TODO, search list of arduino boards (https://github.com/arduino/ArduinoCore-avr/blob/master/boards.txt)
const VID = "2341";
const PID = "0043";

async function main(): Promise<void> {
  const availableDevices = await SerialPort.list();

  const arduinoUnoInfo = availableDevices.find(info => info.vendorId === VID && info.productId === PID);

  if (arduinoUnoInfo) {
    var port = new SerialPort(arduinoUnoInfo.comName);

    const parser = port.pipe(new SerialPort.parsers.Ready({delimiter: "READY\r\n"}));
    parser.on("ready", () => onNotifierReader(new Notifier(port)));

    const debugParser = parser.pipe(new SerialPort.parsers.Readline({delimiter: "\r\n"}));
    debugParser.on("data", (data: any) => console.log(`From device: ${data}`));

    const errorParser = parser.pipe(new SerialPort.parsers.Regex({regex: /^ERROR: (.+)\r\n/m}));
    errorParser.on("data", (err: any) => console.error(chalk.red.bold(err)));
  } else {
    console.log("No device detected, is it plugged in?");
    return;
  }
}

async function onNotifierReader(device: Notifier): Promise<void> {
  await device.notify();

  //await device.updateNotification(4, 100);
  await delay(2000);
  await device.updateNotification(7, 200);
}

main();
