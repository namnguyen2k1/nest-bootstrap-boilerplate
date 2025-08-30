import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { TRANSACTION_STATUS, TransactionEntity } from "../entities/transaction.entity";

@Injectable()
export class TransactionRepository extends Repository<TransactionEntity> {
  constructor(private dataSource: DataSource) {
    super(TransactionEntity, dataSource.createEntityManager());
  }

  async createTransaction(data: Partial<TransactionEntity>): Promise<TransactionEntity> {
    const txn = this.create(data);
    return await this.save(txn);
  }

  async findById(id: number): Promise<TransactionEntity | null> {
    return await this.findOne({ where: { id }, relations: ["wallet"] });
  }

  async findByWalletId(walletId: number) {
    return await this.find({
      where: { wallet: { id: walletId } },
      relations: ["wallet"],
      order: { createdAt: "DESC" },
    });
  }

  async updateStatus(id: number, status: TRANSACTION_STATUS): Promise<TransactionEntity> {
    const txn = await this.findOneBy({ id });
    if (!txn) throw new Error("TransactionEntity not found");
    txn.status = status;
    return await this.save(txn);
  }

  async deleteTransaction(id: number): Promise<void> {
    await this.delete(id);
  }
}
