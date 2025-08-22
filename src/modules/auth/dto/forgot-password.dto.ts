import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber, IsString, Length } from "class-validator";

export class ForgotPasswordDto {
  @ApiProperty({
    description: "Email address of the account",
    example: "user@example.com",
  })
  @IsEmail({}, { message: "Invalid email address" })
  @IsNotEmpty({ message: "Email must not be empty" })
  email: string;

  @ApiProperty({
    description: "New password of the account (minimum 8 characters)",
    example: "user12345",
  })
  @IsString({ message: "New password must be a string" })
  @Length(8, 64, {
    message: "New password must be between 8 and 64 characters",
  })
  newPassword: string;

  @ApiProperty({
    description: "OTP verification code for resetting the password",
    example: 123456,
  })
  @IsNumber({}, { message: "OTP code must be a number" })
  code: number;
}
