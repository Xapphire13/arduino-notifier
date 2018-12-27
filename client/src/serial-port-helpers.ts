import SerialPort from "serialport";

export async function write(port: SerialPort, data: string | number[] | Buffer): Promise<void> {
  await new Promise((res, rej) => port.write(data, err => err ? rej(err) : res()));
  return new Promise((res, rej) => port.drain(err => err ? rej(err): res()));
}
