import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsObject, IsOptional, Min } from "class-validator";

export class PagingDTO {
  @ApiPropertyOptional({
    description: "Offset (page)",
    default: 0,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  offset: number = 0;

  @ApiPropertyOptional({
    description: "Limit result per page",
    default: 20,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  limit: number = 20;

  @ApiPropertyOptional({
    description: "Sort object, where keys are field names and values are 1, -1",
    type: Object,
    default: {},
    example: { createdAt: -1 },
  })
  @IsOptional()
  @IsObject()
  sort: Record<string, 1 | -1> = {};
}
