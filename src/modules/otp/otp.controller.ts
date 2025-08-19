import { PublicAPI } from '@auth/decorators/public-api.decorator';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateOtpDTO } from './dto/create-otp.dto';
import { OtpService } from './otp.service';

@Controller('otp')
@ApiTags('otp')
@ApiBearerAuth()
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

  @Post()
  async createOtp(@Body() body: CreateOtpDTO) {
    const result = await this.otpService.createOtp(body);
    return {
      _message: 'create OTP successfully',
      data: result,
    };
  }
}
