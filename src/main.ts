import { ValidationPipe, VersioningType } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { HttpAdapterHost, NestFactory, Reflector } from "@nestjs/core";
import { HttpExceptionFilter } from "@shared/exception-filters";
import cacheConfig from "src/config/cache.config";
import {
  HttpCacheInterceptor,
  LoggingInterceptor,
  ResponseTransformInterceptor,
} from "src/shared/interceptors";
import { configureCORS, configureSwagger } from "src/shared/middlewares";
import { AppModule } from "./app.module";
import appConfig from "./config/app.config";
import { TelegramBotService } from "./http-client/third-part-services/telegram/telegram-bot.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ["error", "warn"],
  });
  const config = app.get<ConfigType<typeof appConfig>>(appConfig.KEY);

  app.enableVersioning({
    type: VersioningType.URI,
  });
  configureSwagger(app);
  configureCORS(app);
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new ResponseTransformInterceptor(),
    new HttpCacheInterceptor(
      app.get("CACHE_MANAGER"),
      app.get(Reflector),
      app.get<ConfigType<typeof cacheConfig>>(cacheConfig.KEY),
    ),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.useGlobalFilters(
    new HttpExceptionFilter(app.get(HttpAdapterHost), app.get(TelegramBotService)),
  );

  console.time(`[app] server is running at: ${config.url}`);
  await app.listen(config.port).then(() => {
    console.timeEnd(`[app] server is running at: ${config.url}`);
  });
}
void bootstrap();
