import { registerAs } from "@nestjs/config";

export default registerAs("DATABASE_CONFIG", () => {
  return {
    env: process.env.APP_ENV || "development",
    mongo: {
      url: process.env.MONGO_URL,
      database: process.env.MONGO_DB_NAME,
    },
    postgres: {
      url: process.env.POSTGRES_URL,
      database: process.env.POSTGRES_DB_NAME,
    },
  };
});
