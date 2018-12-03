import SerialPort from "serialport";

// TODO, search list of arduino boards (https://github.com/arduino/ArduinoCore-avr/blob/master/boards.txt)
const VID = "2341";
const PID = "0043";

async function main(): Promise<void> {
  const availableDevices = await SerialPort.list();

  const arduinoUnoInfo = availableDevices.find(info => info.vendorId === VID && info.productId === PID);

  if (arduinoUnoInfo) {
    var port = new SerialPort(arduinoUnoInfo.comName);
    const parser = port.pipe(new SerialPort.parsers.Ready({delimiter: "READY"}));
    parser.on("ready", () => onArduinoReady(port));
  } else {
    console.log("No Arduino detected");
    return;
  }
}

async function write(port: SerialPort, data: string | number[] | Buffer): Promise<number> {
  return new Promise((res, rej) => port.write(data, (err, bytesWritten) => err ? rej(err) : res(bytesWritten)));
}

async function onArduinoReady(port: SerialPort): Promise<void> {
  await write(port, [1]);
  process.exit(0);
}

main();
