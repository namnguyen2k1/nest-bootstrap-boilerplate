import { ConfigurationModule } from '@config/configuration.module';
import { Module, OnModuleInit } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CachingModule } from 'src/cache/caching.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { RoleModule } from 'src/modules/role/role.module';
import { UserModule } from 'src/modules/user/user.module';
import { QueueModule } from 'src/queue/queue.module';
import { RateLimitModule } from 'src/rate-limit/rate-limit.module';
import { SocketModule } from 'src/socket/socket.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CronModule } from './cron/cron.module';
import { DiskStorageModule } from './disk-storage/disk-storage.module';
import { HttpClientModule } from './http-client/http-client.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import { AssistantModule } from './modules/assistant/assistant.module';
import { DeviceModule } from './modules/device/device.module';
import { NotificationModule } from './modules/notification/notification.module';
import { OtpModule } from './modules/otp/otp.module';
import { PostModule } from './modules/post/post.module';
import { TokenModule } from './modules/token/token.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    ConfigurationModule,
    QueueModule,
    SocketModule,
    CronModule,
    CachingModule,
    RateLimitModule,
    HttpClientModule,

    DiskStorageModule,
    DatabaseModule,

    UserModule,
    AuthModule,
    RoleModule,
    NotificationModule,
    PostModule,
    OtpModule,
    TokenModule,
    DeviceModule,
    AssistantModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly appService: AppService) {}

  onModuleInit() {
    // Only run the first time after starting the app
    // this.appService.checkAndInitialDatabase();
  }
}
