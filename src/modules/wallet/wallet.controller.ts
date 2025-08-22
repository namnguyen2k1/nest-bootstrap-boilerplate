import { PublicAPI } from "@auth/decorators/public-api.decorator";
import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { NoCache } from "@shared/decorators/no-cache.decorator";
import { MongoIdPipe } from "@shared/pipes/mongoid.pipe";
import { CreateWalletDto } from "./dto/create-wallet.dto";
import { DepositDto } from "./dto/deposit.dto";
import { WithdrawDto } from "./dto/withdraw.dto";
import { WalletService } from "./wallet.service";

@Controller("wallets")
@ApiTags("wallets")
@PublicAPI()
@NoCache()
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post("")
  async createWallet(@Body() body: CreateWalletDto) {
    const result = await this.walletService.createWallet(body);
    return {
      _message: "Create wallet successfully",
      data: result,
    };
  }

  @Get(":userId")
  async getWallet(@Param("userId", MongoIdPipe) userId: string) {
    const result = await this.walletService.getWalletByUserId(userId);
    return {
      _message: "Get wallet successfully",
      data: result,
    };
  }

  @Get(":userId/balance")
  async getBalance(@Param("userId", MongoIdPipe) userId: string) {
    const result = await this.walletService.getBalance(userId);
    return {
      _message: "Get balance successfully",
      data: result,
    };
  }

  @Post("deposit")
  async deposit(@Body() body: DepositDto) {
    const result = await this.walletService.deposit(body);
    return {
      _message: "Deposit successfully",
      data: result,
    };
  }

  @Post("withdraw")
  async withdraw(@Body() body: WithdrawDto) {
    const result = await this.walletService.withdraw(body);
    return {
      _message: "Withdraw successfully",
      data: result,
    };
  }

  @Get(":userId/transactions")
  async getTransactions(@Param("userId", MongoIdPipe) userId: string) {
    const result = await this.walletService.getTransactions(userId);
    return {
      _message: "Get all transaction successfully",
      data: result,
    };
  }
}
