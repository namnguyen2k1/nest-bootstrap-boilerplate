import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TIME_ZONE } from '@shared/utils/time-zone';
import { NotificationService } from 'src/modules/notification/services/notification.service';
import { OtpService } from 'src/modules/otp/otp.service';

function CronVN(cronTime: string | Date) {
  return Cron(cronTime, { timeZone: TIME_ZONE.VIETNAM });
}

@Injectable()
export class CronService {
  constructor(
    private readonly otpService: OtpService,
    private readonly notificationService: NotificationService,
  ) {}

  @CronVN('0 0 */2 * *')
  async deleteExpiredOTP() {
    const now = new Date();
    await this.otpService.otpModel.deleteMany({
      expiredAt: { $lte: now },
    });
    console.log('[Cron] deleteExpiredOTP');
  }

  @CronVN(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async deleteOldNotifications() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    await this.notificationService.notificationModel.deleteMany({
      createdAt: { $lte: sevenDaysAgo },
    });
    console.log('[Cron] deleteOldNotifications successfully');
  }
}
