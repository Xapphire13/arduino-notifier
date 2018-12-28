export default interface Plugin {
  init(): Promise<void>;
  onNotify(callback: () => Promise<void>): void;
  onUpdateNotification(callback: (flashSpeed: number) => Promise<void>): void;
}
