import Plugin from "../../plugin";
import Notifier from "../../notifier";
import OutlookNotifier from "./outlook-notifier";
import path from "path";
import fs from "fs";
import util from "util";

const DLL_PATH = path.resolve(__dirname, "../../../../OutlookNotifier/out/netcoreapp2.1/OutlookNotifier.dll");

class OutlookPlugin implements Plugin {
  private outlook: OutlookNotifier | null = null;

  public async init(notifier: Notifier): Promise<void> {
    const dllExists = await util.promisify(fs.access)(DLL_PATH, fs.constants.F_OK).then(() => true, () => false);

    if (!dllExists) {
      throw "OutlookNotifier.dll not found";
    }

    this.outlook = new OutlookNotifier(DLL_PATH);
    this.outlook.on("reminder", () => notifier.notify());
    this.outlook.on("countChange", count => notifier.updateNotification(7, count > 0 ? 100 : 0));
  }
}

export default new OutlookPlugin();
