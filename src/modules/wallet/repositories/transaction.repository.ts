import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Transaction, TRANSACTION_STATUS } from "../entities/transaction.entity";

@Injectable()
export class TransactionRepository extends Repository<Transaction> {
  constructor(private dataSource: DataSource) {
    super(Transaction, dataSource.createEntityManager());
  }

  async createTransaction(data: Partial<Transaction>): Promise<Transaction> {
    const txn = this.create(data);
    return await this.save(txn);
  }

  async findById(id: number): Promise<Transaction | null> {
    return await this.findOne({ where: { id }, relations: ["wallet"] });
  }

  async findByWalletId(walletId: number) {
    return await this.find({
      where: { wallet: { id: walletId } },
      relations: ["wallet"],
      order: { createdAt: "DESC" },
    });
  }

  async updateStatus(id: number, status: TRANSACTION_STATUS): Promise<Transaction> {
    const txn = await this.findOneBy({ id });
    if (!txn) throw new Error("Transaction not found");
    txn.status = status;
    return await this.save(txn);
  }

  async deleteTransaction(id: number): Promise<void> {
    await this.delete(id);
  }
}
