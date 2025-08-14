import { registerAs } from '@nestjs/config';

export default registerAs('AUTH_CONFIG', () => {
  return {
    jwt: {
      accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || 'TOKEN_SECRET_KEY',
      accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '600s',
      refreshTokenSecret:
        process.env.REFRESH_TOKEN_SECRET || 'REFRESH_TOKEN_SECRET_KEY',
      refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '1h',
      secretApiKey: process.env.SECRET_API_KEY || 'SECRET_API_KEY',
      saltOrRounds: Number(process.env.SALT_OR_ROUNDS) || 10,
    },
    otp: {
      expiresIn: process.env.OTP_CODE_EXPIRES_IN || '5m',
    },
  };
});
