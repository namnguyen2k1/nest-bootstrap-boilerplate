import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class FilterDTO {
  @ApiPropertyOptional({
    description: "Text search keyword",
    default: "",
  })
  @IsString()
  @IsOptional()
  text: string = "";
}
