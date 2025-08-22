import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class UpdateUserInfoDto {
  @ApiProperty({
    description: "Status to enable/disable two-factor authentication (2FA)",
    example: true,
  })
  @IsBoolean({ message: "enable2FA must be a boolean value" })
  enable2FA: boolean;

  @ApiProperty({
    description: "User full name",
    example: "John Doe",
  })
  @IsString({ message: "name must be a string" })
  @IsNotEmpty({ message: "name must not be empty" })
  name: string;
}
