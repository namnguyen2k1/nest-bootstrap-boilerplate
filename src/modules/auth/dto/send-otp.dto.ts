import { ApiProperty } from "@nestjs/swagger";
import { OTP_TYPE } from "@otp/otp.model";
import { Transform } from "class-transformer";
import { IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator";

export class SendOtpDto {
  @ApiProperty({
    description: "Type of OTP",
    enum: OTP_TYPE,
    example: OTP_TYPE.VERIFY_CHANGE_PASSWORD,
  })
  @IsString()
  @Transform(({ value }) => String(value).toUpperCase())
  @IsEnum(OTP_TYPE)
  type: OTP_TYPE;

  @ApiProperty({
    description: "Subscribe email",
    example: "user@example.com",
  })
  @IsEmail({}, { message: "Invalid Email" })
  @IsNotEmpty({ message: "Email is required" })
  email: string;
}
