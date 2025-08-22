import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class RefreshTokenDto {
  @ApiProperty({
    description: "Refresh token is issued upon login",
    example: "",
  })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
