import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationModule } from 'src/modules/notification/notification.module';
import { OtpModule } from 'src/modules/otp/otp.module';
import { CronService } from './cron.service';

@Module({
  imports: [
    ScheduleModule.forRoot({
      cronJobs: true,
      intervals: true,
      timeouts: true,
    }),
    NotificationModule,
    OtpModule,
  ],
  providers: [CronService],
  exports: [CronService],
})
export class CronModule {}
