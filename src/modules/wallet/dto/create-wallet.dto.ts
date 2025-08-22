import { ApiProperty } from "@nestjs/swagger";
import { MongoIdTransform } from "@shared/utils/mongoid-transform";
import { IsNumber, IsOptional, IsString, Length, Min } from "class-validator";

export class CreateWalletDto {
  @ApiProperty({
    description: "User ID from MongoDB (ObjectId string with 24 characters)",
    example: "64b1fbc2f9d1c2a1e8b0f3a7",
  })
  @IsString()
  @Length(24, 24, {
    message: "userId must be a valid ObjectId (24 characters)",
  })
  @MongoIdTransform()
  userId: string;

  @ApiProperty({
    description: "Initial wallet balance (defaults to 0 if not provided)",
    example: 100000,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  balance?: number;
}
