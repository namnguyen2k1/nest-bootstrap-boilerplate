import { Request } from "express";

export function getCurl(request: Request): string {
  const { method, originalUrl, headers, body, query, protocol } = request;
  const host = request.headers["host"] || request.get("host");
  let curl = `curl -X ${method.toUpperCase()} "${protocol}://${host}${originalUrl}`;

  // mapping query params
  if (Object.keys(query).length > 0) {
    const queryString = Object.entries(query)
      .map(([key, value]) => `${key}=${encodeURIComponent(value + "")}`)
      .join("&");
    curl += `?${queryString}`;
  }

  curl += `"`;

  // mapping headers
  Object.entries(headers).forEach(([key, value]) => {
    curl += ` -H "${key}: ${value}"`;
  });

  // mapping body
  if (body && Object.keys(body).length > 0) {
    curl += ` -d '${JSON.stringify(body)}'`;
  }

  return curl;
}
