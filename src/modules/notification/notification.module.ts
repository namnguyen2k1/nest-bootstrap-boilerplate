import appConfig from "@config/app.config";
import { Inject, Module, OnModuleInit } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { DB_COLLECTION, DB_CONNECTION } from "src/infrastructure/database/mongodb/constant";
import { MongodbModule } from "src/infrastructure/database/mongodb/mongodb.module";
import { NotificationController } from "./notification.controller";
import { NotificationRepository } from "./notification.repository";
import { NotificationSchema } from "./notification.schema";
import { NotificationService } from "./services/notification.service";
import { SseService } from "./services/sse.service";

@Module({
  imports: [
    MongodbModule,
    MongooseModule.forFeature(
      [
        {
          name: DB_COLLECTION.NOTIFICATION,
          schema: NotificationSchema,
        },
      ],
      DB_CONNECTION.PLAYGROUND,
    ),
    //
  ],
  controllers: [NotificationController],
  providers: [NotificationRepository, SseService, NotificationService],
  exports: [NotificationService],
})
export class NotificationModule implements OnModuleInit {
  constructor(
    @Inject(appConfig.KEY)
    private readonly config: ConfigType<typeof appConfig>,
  ) {}

  onModuleInit() {
    const { url } = this.config;
    console.log(`[sse] stream is listening at: ${url}/global-stream`);
  }
}
