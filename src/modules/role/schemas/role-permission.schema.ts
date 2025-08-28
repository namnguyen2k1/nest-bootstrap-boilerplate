import { SchemaFactory } from "@nestjs/mongoose";
import { RolePermission } from "@role/models/role-permission.model";
import { HydratedDocument } from "mongoose";
import { MongodbUtils } from "src/infrastructure/database/mongodb/mongodb.utils";

export type RolePermissionDocument = HydratedDocument<RolePermission>;

export const RolePermissionSchema = SchemaFactory.createForClass(RolePermission);

RolePermissionSchema.loadClass(RolePermission);

MongodbUtils.customSchemaHooks({ schema: RolePermissionSchema });
