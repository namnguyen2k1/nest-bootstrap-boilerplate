import { PublicAPI } from '@auth/decorators/public-api.decorator';
import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OtpService } from './otp.service';

@Controller('otp')
@ApiTags('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Get('info/:code')
  @PublicAPI()
  async getByCode(@Param('code') code: number) {
    const otp = await this.otpService.getByCode(code);
    return {
      _message: 'Get information of OTP successfully',
      data: otp,
    };
  }
}
