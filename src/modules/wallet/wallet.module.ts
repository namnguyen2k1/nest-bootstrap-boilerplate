import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "@user/user.module";
import { Transaction } from "./entities/transaction.entity";
import { Wallet } from "./entities/wallet.entity";
import { TransactionRepository } from "./repositories/transaction.repository";
import { WalletRepository } from "./repositories/wallet.repository";
import { WalletController } from "./wallet.controller";
import { WalletService } from "./wallet.service";

const PROVIDERS = [WalletRepository, TransactionRepository, WalletService];

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([Wallet, Transaction]),
    //
  ],
  controllers: [WalletController],
  providers: [...PROVIDERS],
  exports: [...PROVIDERS],
})
export class WalletModule {}
