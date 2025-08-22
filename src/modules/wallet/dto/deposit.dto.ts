import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty, IsNumber, Min } from "class-validator";

export class DepositDto {
  @ApiProperty({
    description: "The ID of the user in MongoDB",
    example: "64fa1c9a8b3d4e12f0a12345",
  })
  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: "Deposit amount",
    example: 100000,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  amount: number;
}
