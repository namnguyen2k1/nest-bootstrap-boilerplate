import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class RegisterBodyDto {
  @ApiProperty({
    example: "user@example.com",
    description: "Your email",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: "User Test",
    minLength: 1,
    maxLength: 50,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  name: string;

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

  @ApiProperty({
    example: "0987654321",
    description: "Valid phone number",
    minLength: 10,
    maxLength: 15,
  })
  @IsString()
  @MinLength(10)
  @MaxLength(15)
  phone: string;
}
