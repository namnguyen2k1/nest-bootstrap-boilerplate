import { Body, Controller, Ip, Post, Req } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { parseUserAgent } from "@shared/utils/parse-user-agent";
import { Request } from "express";
import { AuthService } from "./auth.service";
import { PublicAPI } from "./decorators/public-api.decorator";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { LoginBodyDto } from "./dto/login.dto";
import { LogoutBodyDto } from "./dto/logout.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { RegisterBodyDto } from "./dto/register.dto";
import { SendOtpDto } from "./dto/send-otp.dto";
import { VerifyOtpDto } from "./dto/verify-otp.dto";

@Controller("auth")
@ApiTags("auth")
@ApiBearerAuth()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @PublicAPI()
  async register(@Body() body: RegisterBodyDto) {
    const result = await this.authService.register(body);

    return {
      _message: "We just send a code to your email",
      data: result,
    };
  }

  @Post("verify-register")
  @PublicAPI()
  async verifyRegister(@Body() body: VerifyOtpDto) {
    const result = await this.authService.verifyRegister(body);
    return {
      _status: 201,
      _message: "Register success! You can login with your account",
      data: result,
    };
  }

  @Post("login")
  @PublicAPI()
  async login(@Req() req: Request, @Body() body: LoginBodyDto, @Ip() ip: string) {
    const userAgent = parseUserAgent(req);
    const result = await this.authService.login(body, userAgent, ip);
    return {
      _message: result.enable2FA ? "We just send a code to your email" : "Login Successfully",
      data: result.data,
    };
  }

  @Post("verify-2fa-login")
  @PublicAPI()
  async verify2FALogin(
    @Body()
    body: VerifyOtpDto,
    @Ip() ip: string,
  ) {
    const tokens = await this.authService.verify2FALogin(body, ip);
    return {
      _message: "Verify Login Successfully",
      data: tokens,
    };
  }

  @Post("logout")
  async logout(@Body() { userId, deviceId }: LogoutBodyDto) {
    const result = await this.authService.logout(userId, deviceId);
    return {
      _message: "Logout device successfully",
      data: result,
    };
  }

  @Post("send-otp")
  @PublicAPI()
  async sendOTP(@Body() body: SendOtpDto) {
    /**
     * type: OTP_TYPE.VERIFY_CHANGE_PASSWORD
     * type: OTP_TYPE.VERIFY_FORGOT_PASSWORD
     */
    const result = await this.authService.sendOTP(body);
    return {
      _message: "We just send a code to your email",
      data: result.data,
    };
  }

  @Post("change-password")
  async changePassword(
    @Body()
    body: ChangePasswordDto,
    @Ip() ip: string,
  ) {
    await this.authService.changePassword(body, ip);
    return {
      _message: "Change password successfully",
    };
  }

  @Post("forgot-password")
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    await this.authService.forgotPassword(body);
    return {
      _message: "Update password successfully",
    };
  }

  @Post("refresh-token")
  @PublicAPI()
  async refreshToken(@Body() body: RefreshTokenDto) {
    const result = await this.authService.refreshToken(body);
    return {
      _message: "Get new tokens successfully",
      data: result,
    };
  }
}
