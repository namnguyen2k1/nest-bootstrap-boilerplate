import { SchemaFactory } from "@nestjs/mongoose";
import { UserPermissionModel } from "@user/models/user-permission.model";
import { HydratedDocument } from "mongoose";
import { MongodbUtils } from "src/infrastructure/database/mongodb/mongodb.utils";

export type UserPermissionDocument = HydratedDocument<UserPermissionModel>;

export const UserPermissionSchema = SchemaFactory.createForClass(UserPermissionModel);

UserPermissionSchema.loadClass(UserPermissionModel);

MongodbUtils.customSchemaHooks({ schema: UserPermissionSchema });
