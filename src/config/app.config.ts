import { registerAs } from '@nestjs/config';

export default registerAs('APP_CONFIG', () => {
  return {
    env: process.env.APP_ENV || 'development',
    telegramChatID: process.env.TELEGRAM_CHAT_ID || '',
    port: parseInt(process.env.APP_PORT || '3001', 10),
    name: process.env.APP_NAME || 'NestJS App',
    url:
      process.env.APP_URL || `http://localhost:${process.env.APP_PORT || 3000}`,
  };
});
