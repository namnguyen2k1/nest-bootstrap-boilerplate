import { SchemaFactory } from "@nestjs/mongoose";
import { UserPermission } from "@user/models/user-permission.model";
import { HydratedDocument } from "mongoose";
import { MongodbUtils } from "src/infrastructure/database/mongodb/mongodb.utils";

export type UserPermissionDocument = HydratedDocument<UserPermission>;

export const UserPermissionSchema = SchemaFactory.createForClass(UserPermission);

UserPermissionSchema.loadClass(UserPermission);

MongodbUtils.customSchemaHooks({ schema: UserPermissionSchema });
