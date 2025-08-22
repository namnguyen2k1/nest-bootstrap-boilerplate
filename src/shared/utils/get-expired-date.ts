import dayjs from "dayjs";

export function getExpiredDate(expiresIn: string | number): Date {
  if (typeof expiresIn === "number") {
    return dayjs().add(expiresIn, "second").toDate();
  }

  const str = expiresIn.trim().toLowerCase();
  const match = str.match(
    /^(\d+)\s*(s|sec|secs|second|seconds|m|min|mins|minute|minutes|h|hr|hrs|hour|hours|d|day|days)$/,
  );

  if (!match) {
    throw new Error(`Invalid expiresIn format: ${expiresIn}`);
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

  const unitMap: Record<string, dayjs.ManipulateType> = {
    s: "second",
    sec: "second",
    secs: "second",
    second: "second",
    seconds: "second",
    m: "minute",
    min: "minute",
    mins: "minute",
    minute: "minute",
    minutes: "minute",
    h: "hour",
    hr: "hour",
    hrs: "hour",
    hour: "hour",
    hours: "hour",
    d: "day",
    day: "day",
    days: "day",
  };

  return dayjs().add(value, unitMap[unit]).toDate();
}
