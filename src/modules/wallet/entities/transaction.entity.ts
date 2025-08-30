import { BaseEntity, BasePostgresqlType } from "@entities/base.entity";
import { Column, Entity, Index, ManyToOne } from "typeorm";
import { Wallet, WalletEntity } from "./wallet.entity";

export enum TRANSACTION_STATUS {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
}

export enum TRANSACTION_TYPE {
  TOPUP = "TOPUP",
  WITHDRAW = "WITHDRAW",
  TRANSFER = "TRANSFER",
  DEPOSIT = "DEPOSIT",
}

export interface Transaction extends BasePostgresqlType {
  wallet: Wallet;
  amount: number;
  type: TRANSACTION_TYPE;
  provider: string; // Momo, Zalopay...
  providerTxnId: string; // Momo transactionId
  status: TRANSACTION_STATUS;
}

@Entity("transactions")
export class TransactionEntity extends BaseEntity implements Transaction {
  @ManyToOne(() => WalletEntity, (wallet) => wallet.transactions, {
    onDelete: "CASCADE",
  })
  wallet: Wallet;

  @Column({ type: "bigint" })
  amount: number;

  @Column({ type: "varchar", length: 20 })
  type: TRANSACTION_TYPE;

  @Column({ type: "varchar", length: 20, nullable: true })
  provider: string; // Momo, Zalopay...

  @Index()
  @Column({ type: "varchar", length: 100, nullable: true })
  providerTxnId: string; // Momo transactionId

  @Column({ type: "varchar", length: 20 })
  status: TRANSACTION_STATUS;
}
