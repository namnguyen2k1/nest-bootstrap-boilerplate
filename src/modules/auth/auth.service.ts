import { Device, DEVICE_STATUS } from "@models/device.model";
import { OTP_TYPE } from "@models/otp.model";
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  GoneException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { JsonWebTokenError, TokenExpiredError } from "@nestjs/jwt";
import { ROLE_KEY } from "@role/models/role.model";
import { RoleService } from "@role/role.service";
import { getExpiredDate } from "@shared/utils/get-expired-date";
import { toObjectId } from "@shared/utils/to-object-id";
import { toStringSafe } from "@shared/utils/to-string-safe";
import { USER_STATUS } from "@user/models/user.model";
import { UserService } from "@user/user.service";
import authConfig from "src/config/auth.config";
import { HashingService } from "src/modules/token/services/hashing.service";
import {
  JsonWebTokenService,
  JwtPayload,
  TOKEN_TYPE,
} from "src/modules/token/services/json-web-token.service";
import { MailService } from "../../mail/mail.service";
import { DeviceService } from "../device/device.service";
import { OtpService } from "../otp/otp.service";
import { TokenService } from "../token/services/token.service";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { LoginBodyDto } from "./dto/login.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { RegisterBodyDto } from "./dto/register.dto";
import { SendOtpDto } from "./dto/send-otp.dto";
import { VerifyOtpDto } from "./dto/verify-otp.dto";
import { AUTH_ERROR } from "./enum/auth-error-code.enum";

@Injectable()
export class AuthService {
  constructor(
    @Inject(authConfig.KEY)
    private readonly config: ConfigType<typeof authConfig>,

    private readonly hashingService: HashingService,
    private readonly jsonWebTokenService: JsonWebTokenService,
    private readonly emailService: MailService,
    private readonly otpService: OtpService,

    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly deviceService: DeviceService,
    private readonly tokenService: TokenService,
  ) {}

  async verifyAndHandleOTPError(code: number, type: OTP_TYPE) {
    const result = await this.otpService.verifyOTP(code, type);
    const { otp, verifyStatus } = result;
    const { isExpired, isUsed, isValid } = verifyStatus;
    if (isUsed) {
      throw new ConflictException("OTP has already been used");
    } else if (isExpired) {
      throw new GoneException("OTP has expired");
    } else if (isValid) {
      await this.otpService.markOtpAsUsed(otp.id);
    }
    return otp;
  }

  async register(dto: RegisterBodyDto) {
    // 1. Check if the email is already registered
    const existedUser = await this.userService.findByEmail(dto.email, [
      USER_STATUS.ACTIVE,
      USER_STATUS.VERIFYING,
    ]);
    if (existedUser) {
      if (existedUser.status === USER_STATUS.VERIFYING) {
        throw new ConflictException(`Need to verify ${dto.email} email`);
      }
      throw new ConflictException(`User ${dto.email} already exists`);
    }

    // 2. Create a new user with status = USER_STATUS.VERIFYING
    const clientRoleId = await this.roleService.getRoleId(ROLE_KEY.CLIENT);
    const hashedPassword: string = await this.hashingService.hash(dto.password);
    const user = await this.userService.create({
      email: dto.email,
      name: dto.name,
      phone: dto.phone,
      password: hashedPassword,
      roleId: clientRoleId,
      status: USER_STATUS.VERIFYING,
    });

    // 3. Generate an OTP code and upsert it in the database
    const code: number = this.otpService.generateCode();
    const type = OTP_TYPE.VERIFY_REGISTER;
    const filterOtp = {
      userId: toObjectId(user.id),
      type,
    };
    await this.otpService.createOrUpdateIfExisted(filterOtp, {
      ...filterOtp,
      code,
      expiredAt: getExpiredDate(this.config.otp.expiresIn),
    });

    // 4. Send the OTP code to the user's email
    const result = await this.emailService.sendOTP({
      email: dto.email,
      code,
      username: dto.name,
      type,
      expiredAt: getExpiredDate(this.config.otp.expiresIn),
    });
    return result;
  }

  async verifyRegister(payload: VerifyOtpDto) {
    // 1. verify otp code
    await this.verifyAndHandleOTPError(payload.code, OTP_TYPE.VERIFY_REGISTER);
    // 2. find and update user status
    const user = await this.userService.findByEmail(payload.email, [USER_STATUS.VERIFYING]);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    const result = await this.userService.update({
      userId: user.id,
      data: {
        status: USER_STATUS.ACTIVE,
      },
    });

    return result;
  }

  async login(dto: LoginBodyDto, userAgent: Partial<Device>, ip: string) {
    // 1. Check if the user exists
    const user = await this.userService.findByEmail(dto.email);
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    if (user?.status === USER_STATUS.BLOCK) {
      throw new NotFoundException(`User not found (blocked)`);
    }

    // 2. Validate the password
    const validPassword = await this.hashingService.compare(dto.password, user.password);
    if (!validPassword) {
      throw new BadRequestException(`Invalid Password`);
    }

    // 3. Check the number of active logged-in devices
    const roleId: string = toStringSafe(user.roleId);
    const role = await this.roleService.findById(roleId);
    const activeDevice = await this.deviceService.find({
      userId: toObjectId(user.id),
      status: DEVICE_STATUS.ACTIVE,
    });
    if (activeDevice.length >= role.maxDeviceLogin) {
      throw new ForbiddenException(`Maximum device login reached`);
    }

    // 4. Check if 2FA is enabled for the user
    if (user.enable2FA) {
      const code: number = this.otpService.generateCode();
      const type = OTP_TYPE.VERIFY_2FA;
      const filterOtp = {
        userId: toObjectId(user.id),
        type,
      };
      await this.otpService.createOrUpdateIfExisted(filterOtp, {
        ...filterOtp,
        code,
        expiredAt: getExpiredDate(this.config.otp.expiresIn),
      });
      const result = await this.emailService.sendOTP({
        email: dto.email,
        type: OTP_TYPE.VERIFY_2FA,
        username: user.name,
        code,
        expiredAt: getExpiredDate(this.config.otp.expiresIn),
      });
      return {
        enable2FA: true,
        ...result,
      };
    }

    // 5. Create a new active device record (if it does not exist)
    const filterDevice = {
      userId: toObjectId(user.id),
      ip: ip,
    };
    const device = await this.deviceService.createOrUpdateIfExisted(filterDevice, {
      ...filterDevice,
      ...userAgent,
      status: DEVICE_STATUS.ACTIVE,
      lastLogin: new Date(),
    });

    // 6. Generate access token + refresh token
    const tokens = await this.generateTokens({
      userId: user.id,
      deviceId: device.id,
    });

    // 7. Store the hashed refresh token in the database
    const { value, expiresIn } = tokens.refreshToken;
    const hashRefreshToken = await this.hashingService.hash(value);
    const filterToken = {
      deviceId: toObjectId(device.id),
      userId: toObjectId(user.id),
    };
    await this.tokenService.createOrUpdateIfExisted(filterToken, {
      ...filterToken,
      refreshToken: hashRefreshToken,
      expiredAt: getExpiredDate(expiresIn),
    });
    return {
      error: null,
      enable2FA: false,
      data: tokens,
    };
  }

  async verify2FALogin(payload: VerifyOtpDto, ip: string) {
    // 1. Validate the OTP for 2FA login
    await this.verifyAndHandleOTPError(payload.code, OTP_TYPE.VERIFY_2FA);

    // 2. Retrieve the user by email
    const user = await this.userService.findByEmail(payload.email);
    if (!user) {
      throw new NotFoundException("user not found");
    }

    // 3. Find or create a device record for this login
    const filterDevice = {
      userId: toObjectId(user.id),
      ip: ip,
    };
    const device = await this.deviceService.createOrUpdateIfExisted(filterDevice, {
      ...filterDevice,
      status: DEVICE_STATUS.ACTIVE,
    });

    // 4. Generate access & refresh tokens
    const tokens = await this.generateTokens({
      userId: user.id,
      deviceId: device.id,
    });

    // 5. Store the hashed refresh token (create or update if exists)
    const { value, expiresIn } = tokens.refreshToken;
    const hashRefreshToken = await this.hashingService.hash(value);
    const filterToken = {
      deviceId: toObjectId(device.id),
      userId: toObjectId(user.id),
    };
    await this.tokenService.createOrUpdateIfExisted(filterToken, {
      ...filterToken,
      refreshToken: hashRefreshToken,
      expiredAt: getExpiredDate(expiresIn),
    });
    return tokens;
  }

  async generateTokens({ userId, deviceId }: JwtPayload) {
    const { accessTokenExpiresIn, refreshTokenExpiresIn } = this.config.jwt;
    const [accessToken, refreshToken] = await Promise.all([
      ...(["access", "refresh"] as TOKEN_TYPE[]).map((mode) => {
        return this.jsonWebTokenService.signToken({ userId, deviceId }, mode);
      }),
    ]);
    return {
      token: {
        value: accessToken,
        expiresIn: accessTokenExpiresIn,
      },
      refreshToken: {
        value: refreshToken,
        expiresIn: refreshTokenExpiresIn,
      },
    };
  }

  async logout(userId: string, deviceId: string) {
    const result = await Promise.allSettled([
      this.deviceService.updateStatus(deviceId, DEVICE_STATUS.INACTIVE),
      this.tokenService.delete(userId, deviceId),
    ]);

    return !!result;
  }

  async sendOTP(payload: SendOtpDto) {
    // 1. Look up the user by email
    const { email, type } = payload;
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException(`User ${email} not found`);
    }

    // 2. Generate OTP and store it (create or update if it already exists)
    const code: number = this.otpService.generateCode();
    const otpExpiredAt = getExpiredDate(this.config.otp.expiresIn);
    const filterOtp = {
      userId: toObjectId(user.id),
      type,
    };
    await this.otpService.createOrUpdateIfExisted(filterOtp, {
      ...filterOtp,
      code,
      expiredAt: otpExpiredAt,
    });

    // 3. Send the OTP to the user's email
    const result = await this.emailService.sendOTP({
      email,
      code,
      type,
      username: user.name,
      expiredAt: otpExpiredAt,
    });
    return result;
  }

  async changePassword(payload: ChangePasswordDto, ip: string) {
    // verify otp code
    await this.verifyAndHandleOTPError(payload.code, OTP_TYPE.VERIFY_CHANGE_PASSWORD);
    // 2. find user and check valid old password
    const user = await this.userService.findByEmail(payload.email);
    if (!user) {
      throw new NotFoundException(`User ${payload.email} not found`);
    }
    const isMatchOldPassword = await this.hashingService.compare(
      payload.oldPassword,
      user.password,
    );
    if (!isMatchOldPassword) {
      throw new BadRequestException(`Invalid Old Password`);
    }
    // 3. update new password
    const hashNewPassword = await this.hashingService.hash(payload.newPassword);
    await this.userService.update({
      userId: user.id,
      data: {
        password: hashNewPassword,
      },
    });
    // 4. update other devices status = INACTIVE + delete token of device
    const devices = await this.deviceService.find({
      userId: user.id,
    });
    const deviceIds = devices.filter((d) => d.ip != ip).map((d) => d.id);
    const promises: any[] = [];
    for (const deviceId of deviceIds) {
      promises.push(this.tokenService.delete(user.id, deviceId));
      promises.push(this.deviceService.updateStatus(deviceId, DEVICE_STATUS.INACTIVE));
    }
    await Promise.allSettled(promises);
  }

  async forgotPassword(payload: ForgotPasswordDto) {
    // 1. Verify the provided OTP code
    await this.verifyAndHandleOTPError(payload.code, OTP_TYPE.VERIFY_FORGOT_PASSWORD);

    // 2. Find the user and validate the old password
    const user = await this.userService.findByEmail(payload.email);
    if (!user) {
      throw new NotFoundException(`User ${payload.email} not found`);
    }

    // 3. Hash and update the new password
    const hashNewPassword = await this.hashingService.hash(payload.newPassword);
    await this.userService.update({
      userId: user.id,
      data: {
        password: hashNewPassword,
      },
    });

    // 4. Invalidate all other devices (set status to INACTIVE and delete their tokens)
    const devices = await this.deviceService.find({
      userId: user.id,
    });
    const deviceIds = devices.map((d) => d.id);
    await Promise.allSettled([
      ...deviceIds.map((deviceId) => this.tokenService.delete(user.id, deviceId)),
      this.deviceService.deleteByUserId(user.id),
    ]);
  }

  async refreshToken(payload: RefreshTokenDto) {
    // 1. Verify the refresh token (extract userId and deviceId)
    const { refreshToken } = payload;
    const { error, data } = await this.jsonWebTokenService.verifyToken(refreshToken, "refresh");
    if (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException({
          code: AUTH_ERROR.REFRESH_TOKEN_EXPIRED,
          message: "Token has expired",
        });
      }
      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException({
          code: AUTH_ERROR.REFRESH_TOKEN_INVALID,
          message: "Invalid token",
        });
      }
      throw error;
    }
    const { userId, deviceId } = data!;
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    // 2. Find the saved refresh token for this device
    const filterToken = {
      deviceId: toObjectId(deviceId),
      userId: toObjectId(userId),
    };
    const savedRefreshToken = await this.tokenService.findOne(filterToken);
    if (!savedRefreshToken) {
      throw new NotFoundException(`Refresh token not found`);
    }

    // 3. Check if the refresh token is revoked or expired
    if (savedRefreshToken.revokedAt || savedRefreshToken.expiredAt <= new Date()) {
      // remove token + update status device
      await Promise.allSettled([
        this.tokenService.delete(userId, deviceId),
        this.deviceService.updateStatus(deviceId, DEVICE_STATUS.INACTIVE),
      ]);
      throw new UnauthorizedException({
        code: AUTH_ERROR.REFRESH_TOKEN_REVOKED,
        message: "Refresh token revoked or expired. Please log in again",
      });
    }

    // 4. Compare the provided refresh token with the stored hashed token
    const matchedRefreshToken = await this.hashingService.compare(
      refreshToken,
      savedRefreshToken.refreshToken,
    );
    if (!matchedRefreshToken) {
      throw new UnauthorizedException({
        code: AUTH_ERROR.REFRESH_TOKEN_INVALID,
        message: "Invalid token",
      });
    }

    // 5. Generate new tokens
    const tokens = await this.generateTokens({ userId, deviceId });

    // 6. Rotate refresh token (hash and replace)
    const hashedNewRefreshToken = await this.hashingService.hash(tokens.refreshToken.value);
    await this.tokenService.update(filterToken, {
      refreshToken: hashedNewRefreshToken,
      expiredAt: getExpiredDate(this.config.jwt.refreshTokenExpiresIn),
      revokedAt: undefined,
    });

    return tokens;
  }
}
