import { UserPermission } from "@models/user-permission.model";
import { SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { MongodbUtils } from "../mongodb.utils";

export type UserPermissionDocument = HydratedDocument<UserPermission>;

export const UserPermissionSchema = SchemaFactory.createForClass(UserPermission);

UserPermissionSchema.loadClass(UserPermission);

MongodbUtils.customSchemaHooks({ schema: UserPermissionSchema });
