import { ConfigType } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import databaseConfig from 'src/config/database.config';

export const createPostgresqlConfig = (
  dbConfig: ConfigType<typeof databaseConfig>,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: dbConfig.postgres.host,
  port: dbConfig.postgres.port,
  username: dbConfig.postgres.username,
  password: dbConfig.postgres.password,
  database: dbConfig.postgres.database,
  synchronize: dbConfig.env === 'development',
  autoLoadEntities: true,
  retryAttempts: 1,
  retryDelay: 1000,
  logging: dbConfig.env === 'development',
});
