export function viewToString(view: DataView): string {
  const parts: string[] = [];

  for (let i = 0; i < view.byteLength; i++) {
    parts.push(`0x${view.getUint8(i).toString(16).padStart(2, "0")}`);
  }

  return parts.join(" ");
}
