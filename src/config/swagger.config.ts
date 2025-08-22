import { registerAs } from "@nestjs/config";

export default registerAs("SWAGGER_CONFIG", () => {
  return {
    appUrl: process.env.APP_URL || 3001,
    swaggerTitle: process.env.SWAGGER_TITLE || "--",
    swaggerUsername: process.env.SWAGGER_USERNAME || "--",
    swaggerPassword: process.env.SWAGGER_PASSWORD || "--",
    swaggerDescription: process.env.SWAGGER_DESCRIPTION || "--",
    swaggerApiVersion: process.env.SWAGGER_API_VERSION || "v0",
    swaggerPrefix: process.env.SWAGGER_PREFIX || "/docs",
  };
});
