export function parseRedis(url: string) {
  try {
    const obj = new URL(url);
    const database = obj.pathname ? parseInt(obj.pathname.slice(1)) : undefined;
    const redis = {
      url: url,
      host: obj.hostname,
      port: parseInt(obj.port) || 6379,
      username: obj.username || undefined,
      password: obj.password || undefined,
      database,
    };
    return redis;
  } catch (error) {
    console.log("parse redis error", error);
    return {
      url: url,
      host: "",
      port: 6379,
      username: "",
      password: "",
      database: "",
    };
  }
}
