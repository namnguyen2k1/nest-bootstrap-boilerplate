import { registerAs } from '@nestjs/config';

export default registerAs('AI_CONFIG', () => {
  return {
    apiKey: process.env.OPEN_AI_API_KEY || '',
  };
});
