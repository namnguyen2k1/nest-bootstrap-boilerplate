import { PublicAPI } from '@auth/decorators/public-api.decorator';
import {
  Body,
  Controller,
  Delete,
  MessageEvent,
  Param,
  Post,
  Sse,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PagingDTO } from '@shared/dto/paging.dto';
import { MongoIdPipe } from '@shared/pipes/mongoid.pipe';
import { interval, map, merge, Observable } from 'rxjs';
import { SendEventDto } from './dto/send-event.dto';
import { NotificationService } from './services/notification.service';
import { SseService } from './services/sse.service';
import { SSE_TYPE, SsePayload } from './services/sse.type';

@Controller('notifications')
@ApiTags('notifications')
@ApiBearerAuth()
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly sseService: SseService,
  ) {}

  @Post('user/:userId')
  async getAllNotifications(
    @Param('userId', MongoIdPipe) userId: string,
    @Body() paging: PagingDTO,
  ) {
    const result = await this.notificationService.getAllNotificationsOfUser(
      userId,
      paging,
    );
    return {
      _message: 'Get all notifications of user successfully',
      data: result,
    };
  }

  @Post('read-by-user/:userId')
  async markRead(
    @Param('userId', MongoIdPipe) userId: string,
    @Body() body: { notificationIds: string[]; readAll: boolean },
  ) {
    await this.notificationService.markIsRead(userId, body);
    return {
      _message: 'Update status successfully',
    };
  }

  @Delete('user/:notificationId')
  async deleteNotification(
    @Param('notificationId', MongoIdPipe) notificationId: string,
  ) {
    await this.notificationService.deleteNotificationById(notificationId);
    return {
      _message: 'Delete notification successfully',
    };
  }

  @Sse('global-stream')
  streamGlobal(): Observable<MessageEvent> {
    const heartbeat$ = interval(15000).pipe(
      map(() => {
        const data: SsePayload = {
          type: SSE_TYPE.HEARTBEAT,
          data: null,
          timestamp: Date.now(),
        };
        return { data };
      }),
    );
    const events$ = this.sseService.getGlobalStream().pipe(
      map((data) => {
        return { data };
      }),
    );

    return merge(events$, heartbeat$);
  }

  @Sse('user-stream/:userId')
  streamPrivate(
    @Param('userId', MongoIdPipe) userId: string,
  ): Observable<MessageEvent> {
    return this.sseService.getUserStream(userId).pipe(
      map((data) => {
        return { data };
      }),
    );
  }

  @Post('publish-global-event')
  @PublicAPI()
  publishGlobalEvent(@Body() body: SendEventDto) {
    const result = this.notificationService.sendGlobalEvent(body);
    return {
      _message: `Sent event to ${result.data} connections successfully`,
    };
  }

  @Post('publish-user-event/:userId')
  @PublicAPI()
  publishUserEvent(
    @Param('userId', MongoIdPipe) userId: string,
    @Body() body: SendEventDto,
  ) {
    const result = this.notificationService.sendUserEvent(userId, body);
    return {
      _message: result.error
        ? `No active connection found for user ${userId}`
        : `Sent event to user ${userId} successfully`,
    };
  }
}
