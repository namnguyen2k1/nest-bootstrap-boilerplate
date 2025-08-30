import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "@user/user.module";
import { PostgreSQLModule } from "src/infrastructure/database/postgresql/postgresql.module";
import { TransactionEntity } from "./entities/transaction.entity";
import { WalletEntity } from "./entities/wallet.entity";
import { TransactionRepository } from "./repositories/transaction.repository";
import { WalletRepository } from "./repositories/wallet.repository";
import { WalletController } from "./wallet.controller";
import { WalletService } from "./wallet.service";

@Module({
  imports: [
    PostgreSQLModule,
    UserModule,
    TypeOrmModule.forFeature([WalletEntity, TransactionEntity]),
    //
  ],
  controllers: [WalletController],
  providers: [WalletRepository, TransactionRepository, WalletService],
  exports: [WalletService],
})
export class WalletModule {}
