import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import aiConfig from "./ai.config";
import appConfig from "./app.config";
import authConfig from "./auth.config";
import cacheConfig from "./cache.config";
import databaseConfig from "./database.config";
import mailConfig from "./mail.config";
import swaggerConfig from "./swagger.config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
      load: [
        appConfig,
        databaseConfig,
        swaggerConfig,
        authConfig,
        cacheConfig,
        mailConfig,
        aiConfig,
      ],
    }),
  ],
})
export class ConfigurationModule {}
