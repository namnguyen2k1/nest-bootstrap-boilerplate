import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Wallet } from "../entities/wallet.entity";

@Injectable()
export class WalletRepository extends Repository<Wallet> {
  constructor(private dataSource: DataSource) {
    super(Wallet, dataSource.createEntityManager());
  }

  async findByUserId(userId: string): Promise<Wallet | null> {
    return await this.findOne({ where: { userId } });
  }

  async createWallet(userId: string): Promise<Wallet> {
    const wallet = this.create({ userId, balance: 0 });
    return await this.save(wallet);
  }

  async updateWallet(wallet: Wallet): Promise<Wallet> {
    return await this.save(wallet);
  }

  async deleteWallet(walletId: number): Promise<void> {
    await this.delete(walletId);
  }
}
