import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber } from "class-validator";

export class VerifyOtpDto {
  @ApiProperty({
    description: "The OTP verification code sent to the email or phone number",
    example: 123456,
  })
  @IsNumber({}, { message: "The verification code must be a number" })
  @IsNotEmpty({ message: "The verification code is required" })
  code: number;

  @ApiProperty({
    description: "The registered email address",
    example: "user@example.com",
  })
  @IsEmail({}, { message: "Invalid email address" })
  @IsNotEmpty({ message: "Email is required" })
  email: string;
}
