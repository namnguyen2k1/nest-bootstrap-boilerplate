import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { RoleModule } from '@role/role.module';
import { UserModule } from '@user/user.module';
import { CachingModule } from 'src/cache/caching.module';
import { MailModule } from 'src/mail/mail.module';
import { DeviceModule } from '../device/device.module';
import { NotificationModule } from '../notification/notification.module';
import { OtpModule } from '../otp/otp.module';
import { TokenModule } from '../token/token.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtGuard } from './guards/jwt.guard';
import { RequiredAccessGuard } from './guards/required-access.guard';

@Module({
  imports: [
    UserModule,
    RoleModule,
    OtpModule,
    DeviceModule,
    TokenModule,
    CachingModule,
    NotificationModule,
    MailModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RequiredAccessGuard,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
