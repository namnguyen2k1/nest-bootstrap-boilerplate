import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './services/notification.service';
import { SseService } from './services/sse.service';

@Module({
  imports: [],
  controllers: [NotificationController],
  providers: [SseService, NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
