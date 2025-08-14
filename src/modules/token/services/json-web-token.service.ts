import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import authConfig from 'src/config/auth.config';
import { v4 as uuidv4 } from 'uuid';

export interface JwtPayload {
  userId: string;
  deviceId: string;
}

export interface JwtDecoded {
  error?: any;
  data?: JwtPayload & {
    exp: number;
    iat: number;
  };
}

export type TOKEN_TYPE = 'access' | 'refresh';

@Injectable()
export class JsonWebTokenService {
  constructor(
    @Inject(authConfig.KEY)
    private readonly env: ConfigType<typeof authConfig>,

    private readonly jwtService: JwtService,
  ) {}

  async signToken(payload: JwtPayload, mode: TOKEN_TYPE): Promise<string> {
    const {
      accessTokenSecret,
      accessTokenExpiresIn,
      refreshTokenExpiresIn,
      refreshTokenSecret,
    } = this.env.jwt;
    let secret: string = '';
    let expiresIn: string = '';

    switch (mode) {
      case 'access': {
        secret = accessTokenSecret;
        expiresIn = accessTokenExpiresIn;
        break;
      }
      case 'refresh': {
        secret = refreshTokenSecret;
        expiresIn = refreshTokenExpiresIn;
        break;
      }
    }

    return await this.jwtService.signAsync(
      { ...payload, uuid: uuidv4() },
      {
        secret,
        expiresIn,
        algorithm: 'HS256',
      },
    );
  }

  async verifyToken(token: string, mode: TOKEN_TYPE): Promise<JwtDecoded> {
    try {
      const { accessTokenSecret, refreshTokenSecret } = this.env.jwt;
      let secret: string = '';

      switch (mode) {
        case 'access': {
          secret = accessTokenSecret;
          break;
        }
        case 'refresh': {
          secret = refreshTokenSecret;
          break;
        }
      }

      const data: JwtPayload & {
        exp: number;
        iat: number;
      } = await this.jwtService.verifyAsync(token, {
        secret,
      });

      return { data };
    } catch (error) {
      return { error };
    }
  }
}
