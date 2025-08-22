import { OTP, OTP_TYPE } from "@models/otp.model";
import { Injectable, NotFoundException } from "@nestjs/common";
import { OTPRepository } from "@repositories/otp.repository";
import { toObjectId } from "@shared/utils/to-object-id";
import { randomInt } from "crypto";
import { FilterQuery } from "mongoose";
import { CreateOtpDTO } from "./dto/create-otp.dto";

@Injectable()
export class OtpService {
  constructor(private readonly otpRepo: OTPRepository) {}

  get otpModel() {
    return this.otpRepo.model;
  }

  generateCode(): number {
    return randomInt(100000, 1000000);
  }

  async createOtp(dto: CreateOtpDTO) {
    const data: Partial<OTP> = {
      ...dto,
      userId: toObjectId(dto.userId),
    };
    return await this.otpRepo.createOtpWithTransaction(data);
  }

  async createOrUpdateIfExisted(filter: FilterQuery<OTP>, dto: Partial<OTP>) {
    const _filter: FilterQuery<OTP> = {
      ...filter,
      usedAt: null,
    };
    return await this.otpRepo.createOrUpdateIfExisted(_filter, dto);
  }

  async markOtpAsUsed(otpId: string) {
    await this.otpRepo.updateOne(
      { id: otpId },
      {
        usedAt: new Date(),
      },
    );
  }

  async verifyOTP(code: number, type: OTP_TYPE) {
    const otp = await this.otpRepo.findOne({
      code: code,
      type: type,
    });

    if (!otp) {
      throw new NotFoundException(`OTP not found`);
    }

    const isUsed = Boolean(otp.usedAt);
    const isExpired = otp.expiredAt <= new Date();
    const isValid = !isUsed && !isExpired;

    return {
      otp,
      verifyStatus: {
        isUsed,
        isExpired,
        isValid,
      },
    };
  }

  async getByCode(code: number) {
    const otp = await this.otpRepo.findOne({ code });
    if (!otp) {
      throw new NotFoundException("OTP not found");
    }
    return otp;
  }
}
