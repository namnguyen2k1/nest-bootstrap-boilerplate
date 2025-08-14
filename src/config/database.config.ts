import { registerAs } from '@nestjs/config';

export default registerAs('DATABASE_CONFIG', () => {
  return {
    env: process.env.APP_ENV || 'development',
    mongo: {
      uri: process.env.MONGO_URL,
      dbName: process.env.MONGO_DB_NAME,
    },
    postgres: {
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
    },
  };
});
