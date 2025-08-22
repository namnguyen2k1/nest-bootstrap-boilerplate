import { ApiProperty } from "@nestjs/swagger";
import { MongoIdTransform } from "@shared/utils/mongoid-transform";
import { IsString } from "class-validator";

export class LogoutBodyDto {
  @ApiProperty({
    description: "User ID",
    example: "64d4a1c2f2e6a5b9f8e1a1c2",
    type: String,
  })
  @IsString()
  @MongoIdTransform()
  userId: string;

  @ApiProperty({
    description: "Device ID",
    example: "64d4a1c2f2e6a5b9f8e1a1c3",
    type: String,
  })
  @IsString()
  @MongoIdTransform()
  deviceId: string;
}
