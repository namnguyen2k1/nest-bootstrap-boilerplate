import { inspect } from "util";

export function logObj(obj: any) {
  if (!obj) {
    return "null";
  }
  const plain = Object.getPrototypeOf(obj) === null ? { ...obj } : obj;
  if (Object.keys(plain).length === 0) {
    return "{}";
  }
  return inspect(plain, { depth: null, colors: true });
}
