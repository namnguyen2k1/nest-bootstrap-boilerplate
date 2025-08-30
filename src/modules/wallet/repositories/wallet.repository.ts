import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { WalletEntity } from "../entities/wallet.entity";

@Injectable()
export class WalletRepository extends Repository<WalletEntity> {
  constructor(private dataSource: DataSource) {
    super(WalletEntity, dataSource.createEntityManager());
  }

  async findByUserId(userId: string): Promise<WalletEntity | null> {
    return await this.findOne({ where: { userId } });
  }

  async createWallet(userId: string): Promise<WalletEntity> {
    const wallet = this.create({ userId, balance: 0 });
    return await this.save(wallet);
  }

  async updateWallet(wallet: WalletEntity): Promise<WalletEntity> {
    return await this.save(wallet);
  }

  async deleteWallet(walletId: number): Promise<void> {
    await this.delete(walletId);
  }
}
