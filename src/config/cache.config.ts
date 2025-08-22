import { registerAs } from "@nestjs/config";
import { parseRedis } from "@shared/utils/parse-redis";

export default registerAs("CACHE_CONFIG", () => ({
  prefix: process.env.APP_NAME || "NestJS App",
  ttl: parseInt(process.env.CACHE_TTL || "600000"),
  max: parseInt(process.env.CACHE_MAX_ITEMS || "1000"),
  store: process.env.CACHE_STORE || "memory",
  redis: parseRedis(process.env.CACHE_REDIS_URL || ""),
}));
