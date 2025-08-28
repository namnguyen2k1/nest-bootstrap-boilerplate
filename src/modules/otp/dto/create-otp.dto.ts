import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNumber, IsString } from "class-validator";
import { OTP_TYPE } from "../otp.model";

export class CreateOtpDTO {
  @ApiProperty({
    description: "OTP type",
    enum: OTP_TYPE,
    example: OTP_TYPE.VERIFY_DEVICE,
  })
  @IsEnum(OTP_TYPE)
  type: OTP_TYPE;

  @ApiProperty({
    description: "User mongoID",
    example: "689b34d7a51d5545b1cc1bc6",
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: "OTP code",
    example: "123456",
  })
  @IsNumber()
  code: number;

  @ApiProperty({
    description: "OTP expired Date",
    example: Date.now(),
  })
  @IsString()
  expiredAt: Date;
}
