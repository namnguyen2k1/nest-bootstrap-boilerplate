import { Global, Inject, Module, OnModuleInit } from "@nestjs/common";
import { ConfigModule, ConfigType } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TransactionRepository } from "@repositories/transaction.repository";
import { WalletRepository } from "@repositories/wallet.repository";
import databaseConfig from "src/config/database.config";
import { DataSource } from "typeorm";
import { Transaction } from "./entities/transaction.entity";
import { Wallet } from "./entities/wallet.entity";
import { createPostgresqlConfig } from "./postgresql-config";

const PROVIDERS = [
  WalletRepository,
  TransactionRepository,
  // more repositories...
];

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [databaseConfig.KEY],
      useFactory: createPostgresqlConfig,
    }),
    TypeOrmModule.forFeature([Wallet, Transaction]),
  ],
  providers: [...PROVIDERS],
  exports: [...PROVIDERS],
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
        `[database] (postgresql) connected as "${username}" to "${database}" at ${host}:${port}`,
      );
    }
  }
}
