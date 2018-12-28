import SerialPort from "serialport";
import Notifier from "./notifier";
// import delay from "delay";
import Logger from "./logger";
import path from "path";
import fs from "fs";
import util from "util";
import Plugin from "./plugin";

// TODO, search list of arduino boards (https://github.com/arduino/ArduinoCore-avr/blob/master/boards.txt)
const VID = "2341";
const PID = "0043";
const PLUGINS_PATH = path.resolve(__dirname, "./plugins");

async function main(): Promise<void> {
  const availableDevices = await SerialPort.list();
  const arduinoUnoInfo = availableDevices.find(info => info.vendorId === VID && info.productId === PID);

  if (arduinoUnoInfo) {
    Logger.log(`Connecting to: ${arduinoUnoInfo.comName}... `, true);
    var port = new SerialPort(arduinoUnoInfo.comName);

    port.on("error", Logger.error);

    const parser = port.pipe(new SerialPort.parsers.Ready({delimiter: "READY\r\n"}));
    parser.on("ready", () => onNotifierReady(new Notifier(port)));

    const debugParser = parser.pipe(new SerialPort.parsers.Readline({delimiter: "\r\n"}));
    debugParser.on("data", data => Logger.debug(`From device: ${data}`));

    const errorParser = parser.pipe(new SerialPort.parsers.Regex({regex: /^ERROR: (.+)\r\n/m}));
    errorParser.on("data", Logger.error);
  } else {
    Logger.log("No device detected, is it plugged in?");
    return;
  }
}

async function onNotifierReady(device: Notifier): Promise<void> {
  Logger.ok("connected!");
  await loadPlugins(device);
  
  await device.notify();
}

async function loadPlugins(notifier: Notifier): Promise<void> {
  const pluginsDirs = (await util.promisify(fs.readdir)(PLUGINS_PATH));

  let notificationId = 7;
  for (let pluginDir of pluginsDirs) {
    const module = require(path.resolve(PLUGINS_PATH, pluginDir));
    const plugin: Plugin = module.default || module;
    const currentId = notificationId; // Force value copy

    try {
      await plugin.init();
      plugin.onNotify(() => notifier.notify());
      plugin.onUpdateNotification(flashSpeed => notifier.updateNotification(currentId, flashSpeed));
    } catch (err) {
      Logger.error(`Failed to load plugin: ${pluginDir}, exception: ${err}`);
    }

    notificationId--;
  }
}

main();
