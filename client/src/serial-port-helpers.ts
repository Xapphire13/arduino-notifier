import SerialPort from "serialport";

export async function write(port: SerialPort, data: string | number[] | Buffer): Promise<number> {
  return new Promise((res, rej) => port.write(data, (err, bytesWritten) => err ? rej(err) : res(bytesWritten)));
}
