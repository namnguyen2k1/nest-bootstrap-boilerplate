import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber, IsString, Length } from "class-validator";

export class ChangePasswordDto {
  @ApiProperty({
    description: "Email address of the account",
    example: "user@example.com",
  })
  @IsEmail({}, { message: "Invalid email address" })
  @IsNotEmpty({ message: "Email must not be empty" })
  email: string;

  @ApiProperty({
    description: "Current password of the account",
    example: "user1234",
  })
  @IsString({ message: "Old password must be a string" })
  @IsNotEmpty({ message: "Old password must not be empty" })
  oldPassword: string;

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
    description: "OTP verification code for changing the password",
    example: 123456,
  })
  @IsNumber({}, { message: "OTP code must be a number" })
  code: number;
}
