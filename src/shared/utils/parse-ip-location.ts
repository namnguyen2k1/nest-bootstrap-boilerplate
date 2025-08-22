import { Location } from "@models/location.model";
import { Request } from "express";
import geoip from "geoip-lite";

export function parseIpWithLocation(req: Request): Partial<Location> {
  let ip: string =
    req.headers["x-forwarded-for"]?.toString().split(",")[0] ||
    req.socket.remoteAddress ||
    req.ip ||
    "";

  if (ip.startsWith("::ffff:")) {
    ip = ip.replace("::ffff:", "");
  }

  const geo = geoip.lookup(ip);

  if (!geo) {
    return { ip };
  }

  return {
    ip,
    country: geo.country,
    region: geo.region,
    city: geo.city,
    latitude: geo.ll?.[0],
    longitude: geo.ll?.[1],
  };
}
