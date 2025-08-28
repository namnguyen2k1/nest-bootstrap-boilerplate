import { BaseEntity } from "@entities/base.entity";
import { Column, Entity, Index, ManyToOne } from "typeorm";
import { Wallet } from "./wallet.entity";

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

@Entity("transactions")
export class Transaction extends BaseEntity {
  @ManyToOne(() => Wallet, (wallet) => wallet.transactions, {
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
