import { registerAs } from "@nestjs/config";

export default registerAs("CACHE_CONFIG", () => ({
  prefix: process.env.APP_NAME || "NestJS App",
  ttl: parseInt(process.env.CACHE_TTL || "600000"),
  max: parseInt(process.env.CACHE_MAX_ITEMS || "1000"),
  store: process.env.CACHE_STORE || "memory",
  redis: {
    url: process.env.CACHE_REDIS_URL,
    password: process.env.CACHE_REDIS_PASSWORD,
    database: parseInt(process.env.CACHE_REDIS_DB || "0"),
  },
}));
