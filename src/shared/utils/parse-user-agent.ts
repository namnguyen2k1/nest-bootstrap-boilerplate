import { Device } from "@models/device.model";
import { Request } from "express";

export function parseUserAgent(req: Request): Partial<Device> {
  const userAgent = (req.headers["user-agent"] || "").toLowerCase();

  let deviceType: string = "desktop";
  let deviceName: string = "--";
  let os: string = "--";
  let browser: string = "--";
  let browserVersion: string = "--";

  // --- detect device type ---
  if (/mobile|iphone|ipod|android|blackberry|phone/i.test(userAgent)) {
    deviceType = "mobile";
  } else if (/ipad|tablet|kindle|playbook/i.test(userAgent)) {
    deviceType = "tablet";
  }

  // --- detect OS ---
  if (/windows nt/i.test(userAgent)) os = "Windows";
  else if (/mac os x/i.test(userAgent)) os = "MacOS";
  else if (/android/i.test(userAgent)) os = "Android";
  else if (/iphone|ipad|ipod/i.test(userAgent)) os = "iOS";
  else if (/linux/i.test(userAgent)) os = "Linux";

  // --- detect browser ---
  if (/chrome\/([\d.]+)/i.test(userAgent)) {
    browser = "Chrome";
    browserVersion = userAgent.match(/chrome\/([\d.]+)/i)?.[1] || "Unknown";
  } else if (/firefox\/([\d.]+)/i.test(userAgent)) {
    browser = "Firefox";
    browserVersion = userAgent.match(/firefox\/([\d.]+)/i)?.[1] || "Unknown";
  } else if (/safari\/([\d.]+)/i.test(userAgent) && !/chrome/i.test(userAgent)) {
    browser = "Safari";
    browserVersion = userAgent.match(/version\/([\d.]+)/i)?.[1] || "Unknown";
  } else if (/edg\/([\d.]+)/i.test(userAgent)) {
    browser = "Edge";
    browserVersion = userAgent.match(/edg\/([\d.]+)/i)?.[1] || "Unknown";
  } else if (/opr\/([\d.]+)/i.test(userAgent)) {
    browser = "Opera";
    browserVersion = userAgent.match(/opr\/([\d.]+)/i)?.[1] || "Unknown";
  }

  // --- detect device name ---
  if (/iphone/i.test(userAgent)) deviceName = "iPhone";
  else if (/ipad/i.test(userAgent)) deviceName = "iPad";
  else if (/ipod/i.test(userAgent)) deviceName = "iPod";
  else if (/android/i.test(userAgent)) {
    const match = userAgent.match(/android.*;\s([^\);]+)/i);
    if (match && match[1]) deviceName = match[1].trim();
    else deviceName = "Android Device";
  } else if (/windows/i.test(userAgent)) deviceName = "Windows PC";
  else if (/macintosh/i.test(userAgent)) deviceName = "Mac";

  return {
    deviceType,
    deviceName,
    os,
    browser,
    browserVersion,
    userAgent,
  };
}
