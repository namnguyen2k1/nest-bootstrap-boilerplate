import {
  TRANSACTION_STATUS,
  TRANSACTION_TYPE,
} from '@entities/transaction.entity';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TransactionRepository } from '@repositories/transaction.repository';
import { WalletRepository } from '@repositories/wallet.repository';
import { UserService } from '@user/user.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { DepositDto } from './dto/deposit.dto';
import { WithdrawDto } from './dto/withdraw.dto';

@Injectable()
export class WalletService {
  constructor(
    private readonly userService: UserService,
    private readonly walletRepo: WalletRepository,
    private readonly transactionRepo: TransactionRepository,
  ) {}

  async checkExistedUser(userId: string) {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async createWallet(dto: CreateWalletDto) {
    await this.checkExistedUser(dto.userId);
    const existedWallet = await this.walletRepo.findByUserId(dto.userId);
    if (existedWallet) {
      throw new ConflictException('User already has a wallet');
    }
    const wallet = this.walletRepo.create({
      userId: dto.userId,
      balance: dto.balance ?? 0,
    });
    return await this.walletRepo.save(wallet);
  }

  async getWalletByUserId(userId: string) {
    const user = await this.checkExistedUser(userId);
    const wallet = await this.walletRepo.findByUserId(userId);
    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }
    return { ...wallet, user };
  }

  async getBalance(userId: string) {
    await this.checkExistedUser(userId);
    const wallet = await this.getWalletByUserId(userId);
    return Number(wallet.balance);
  }

  async deposit({ userId, amount }: DepositDto) {
    await this.checkExistedUser(userId);
    const wallet = await this.getWalletByUserId(userId);

    wallet.balance = Number(wallet.balance) + amount;
    await this.walletRepo.update(wallet.id, {
      balance: wallet.balance,
    });

    const transaction = this.transactionRepo.create({
      wallet: { id: wallet.id },
      amount,
      type: TRANSACTION_TYPE.DEPOSIT,
      status: TRANSACTION_STATUS.SUCCESS,
    });
    return await this.transactionRepo.save(transaction);
  }

  async withdraw({ userId, amount }: WithdrawDto) {
    await this.checkExistedUser(userId);
    const wallet = await this.getWalletByUserId(userId);

    if (wallet.balance < amount) {
      throw new Error('Insufficient funds');
    }

    wallet.balance = Number(wallet.balance) - amount;
    await this.walletRepo.update(wallet.id, {
      balance: wallet.balance,
    });

    const transaction = this.transactionRepo.create({
      wallet: { id: wallet.id },
      amount,
      type: TRANSACTION_TYPE.WITHDRAW,
      status: TRANSACTION_STATUS.SUCCESS,
    });

    return await this.transactionRepo.save(transaction);
  }

  async getTransactions(userId: string) {
    await this.checkExistedUser(userId);
    const wallet = await this.getWalletByUserId(userId);
    return await this.transactionRepo.findByWalletId(wallet.id);
  }
}
