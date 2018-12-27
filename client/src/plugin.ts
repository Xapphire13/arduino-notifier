import Notifier from "./notifier";

export default interface Plugin {
  init(notifier: Notifier): Promise<void>;
}
