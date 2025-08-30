import { BaseEntity, BasePostgresqlType } from "@entities/base.entity";
import { Column, Entity, OneToMany, Unique } from "typeorm";
import { Transaction, TransactionEntity } from "./transaction.entity";

export interface Wallet extends BasePostgresqlType {
  userId: string; // relation with Users collection (MongoDB)
  balance: number;
  transactions: Transaction[];
}

@Entity("wallets")
@Unique(["userId"])
export class WalletEntity extends BaseEntity implements Wallet {
  @Column({ type: "varchar", length: 24 })
  userId: string; // relation with Users collection (MongoDB)

  @Column({ type: "bigint", default: 0 })
  balance: number;

  @OneToMany(() => TransactionEntity, (txn) => txn.wallet)
  transactions: Transaction[];
}
