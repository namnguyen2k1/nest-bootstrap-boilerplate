import { registerAs } from '@nestjs/config';

export default registerAs('EMAIL_CONFIG', () => ({
  host: process.env.MAIL_HOST || 'smtp.ethereal.email',
  port: parseInt(process.env.MAIL_PORT || '587', 10),
  secure: process.env.MAIL_SECURE === 'true', // true/false string
  auth: {
    user: process.env.MAIL_USER || '',
    pass: process.env.MAIL_PASS || '',
  },
  from: process.env.MAIL_FROM || 'NestJS Project <no-reply@example.com>',
}));
