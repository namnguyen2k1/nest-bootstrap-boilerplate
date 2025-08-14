import { Token } from '@models/token.model';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';
import { TokenRepository } from '@repositories/token.repository';
import { toObjectId } from '@shared/utils/to-object-id';
import { UserService } from '@user/user.service';
import { FilterQuery } from 'mongoose';
import { DeviceService } from 'src/modules/device/device.service';
import { JsonWebTokenService } from 'src/modules/token/services/json-web-token.service';

@Injectable()
export class TokenService {
  constructor(
    private readonly tokenRepo: TokenRepository,
    private readonly jsonWebTokenService: JsonWebTokenService,
    private readonly deviceService: DeviceService,
    private readonly userService: UserService,
  ) {}

  get tokenModel() {
    return this.tokenRepo.model;
  }

  async getAccessTokenInfo(accessToken: string) {
    const { error, data } = await this.jsonWebTokenService.verifyToken(
      accessToken,
      'access',
    );

    if (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Token has expired');
      }
      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException('Invalid token');
      }
      throw error;
    }

    const { userId, deviceId } = data!;
    const [device, user, token] = await Promise.allSettled([
      this.deviceService.findOne({ id: deviceId }),
      this.userService.findById(userId),
      this.tokenRepo.findOne({
        deviceId: toObjectId(deviceId),
      }),
    ]);

    return {
      token: token.status === 'fulfilled' ? token.value : null,
      user: user.status === 'fulfilled' ? user.value : null,
      device: device.status === 'fulfilled' ? device.value : null,
    };
  }

  async findOne(filter: FilterQuery<Token>) {
    return await this.tokenRepo.findOne(filter);
  }

  async create(dto: Partial<Token>) {
    return await this.tokenRepo.create(dto);
  }

  async createOrUpdateIfExisted(
    filter: FilterQuery<Token>,
    dto: Partial<Token>,
  ) {
    return await this.tokenRepo.createOrUpdateIfExisted(filter, dto);
  }

  async update(filter: FilterQuery<Token>, dto: Partial<Token>) {
    return await this.tokenRepo.updateOne(filter, dto);
  }

  async delete(userId: string, deviceId: string) {
    return await this.tokenRepo.deleteOne({
      deviceId: toObjectId(deviceId),
      userId: toObjectId(userId),
    });
  }
}
