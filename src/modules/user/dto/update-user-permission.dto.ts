import { ApiProperty } from "@nestjs/swagger";
import { PERMISSION_KEY } from "@role/models/permission.model";
import { ROLE_KEY } from "@role/models/role.model";
import { Transform } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsEnum, IsString } from "class-validator";

export class UpdateUserPermissionDto {
  @ApiProperty({
    description: "List of user permissions",
    isArray: true,
    enum: PERMISSION_KEY,
  })
  @IsArray()
  @ArrayNotEmpty()
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      return value.map((v) => String(v).toUpperCase());
    }
    return value;
  })
  @IsEnum(PERMISSION_KEY, { each: true })
  permissions: PERMISSION_KEY[];

  @ApiProperty({
    description: "User role key",
    enum: ROLE_KEY,
    example: ROLE_KEY.CLIENT,
  })
  @IsString()
  @Transform(({ value }) => String(value).toUpperCase())
  @IsEnum(ROLE_KEY)
  roleKey: ROLE_KEY;
}
