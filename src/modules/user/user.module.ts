import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { RoleModule } from "@role/role.module";
import { DB_COLLECTION, DB_CONNECTION } from "src/infrastructure/database/mongodb/constant";
import { UserPermissionRepository } from "./repositories/user-permission.repository";
import { UserRepository } from "./repositories/user.repository";
import { UserPermissionSchema } from "./schemas/user-permission.schema";
import { UserSchema } from "./schemas/user.schema";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
  imports: [
    RoleModule,
    MongooseModule.forFeature(
      [
        {
          name: DB_COLLECTION.USER,
          schema: UserSchema,
        },
        {
          name: DB_COLLECTION.USER_PERMISSION,
          schema: UserPermissionSchema,
        },
      ],
      DB_CONNECTION.PLAYGROUND,
    ),
  ],
  controllers: [UserController],
  providers: [UserRepository, UserPermissionRepository, UserService],
  exports: [UserService],
})
export class UserModule {}
