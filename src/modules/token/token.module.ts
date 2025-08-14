import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from '@user/user.module';
import { JsonWebTokenService } from 'src/modules/token/services/json-web-token.service';
import { DeviceModule } from '../device/device.module';
import { HashingService } from './services/hashing.service';
import { TokenService } from './services/token.service';
import { TokenController } from './token.controller';

const PROVIDERS = [JsonWebTokenService, HashingService, TokenService];

@Module({
  imports: [DeviceModule, UserModule],
  controllers: [TokenController],
  providers: [JwtService, ...PROVIDERS],
  exports: [...PROVIDERS],
})
export class TokenModule {}
