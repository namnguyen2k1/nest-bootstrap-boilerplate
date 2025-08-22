import { ObjectId } from "mongodb";

export function toStringSafe(value: any): string {
  if (value == null) {
    return "";
  }
  if (value instanceof ObjectId) {
    return value.toHexString();
  }
  if (["string", "number", "boolean"].includes(typeof value)) {
    return String(value);
  }
  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}
