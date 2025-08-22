import appConfig from "@config/app.config";
import { Inject, Module, OnModuleInit } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { NotificationController } from "./notification.controller";
import { NotificationService } from "./services/notification.service";
import { SseService } from "./services/sse.service";

@Module({
  imports: [],
  controllers: [NotificationController],
  providers: [SseService, NotificationService],
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
