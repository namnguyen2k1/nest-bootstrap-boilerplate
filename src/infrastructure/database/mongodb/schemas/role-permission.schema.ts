import { RolePermission } from "@models/role-permission.model";
import { SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { MongodbUtils } from "../mongodb.utils";

export type RolePermissionDocument = HydratedDocument<RolePermission>;

export const RolePermissionSchema = SchemaFactory.createForClass(RolePermission);

RolePermissionSchema.loadClass(RolePermission);

MongodbUtils.customSchemaHooks({ schema: RolePermissionSchema });
