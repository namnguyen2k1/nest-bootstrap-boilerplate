import { Inject, Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from 'src/config/database.config';
import { DataSource } from 'typeorm';
import { createPostgresqlConfig } from './postgresql-config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [databaseConfig.KEY],
      useFactory: createPostgresqlConfig,
    }),
  ],
})
export class PostgreSQLModule implements OnModuleInit {
  constructor(
    @Inject(databaseConfig.KEY)
    private readonly dbConfig: ConfigType<typeof databaseConfig>,
    private readonly dataSource: DataSource,
  ) {}

  onModuleInit() {
    if (this.dataSource.isInitialized) {
      const { host, port, username, database } = this.dbConfig.postgres;
      console.log(
        `\n[database] (postgresql) connected as "${username}" to "${database}" at ${host}:${port}`,
      );
    }
  }
}
