import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class LoginBodyDto {
  @ApiProperty({
    example: "user@example.com",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: "user1234",
    description: "Password between 8 and 50 characters",
    minLength: 8,
    maxLength: 50,
  })
  @IsString()
  @MinLength(8)
  @MaxLength(50)
  password: string;
}
