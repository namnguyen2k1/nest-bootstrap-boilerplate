import { SchemaFactory } from "@nestjs/mongoose";
import { RolePermissionModel } from "@role/models/role-permission.model";
import { HydratedDocument } from "mongoose";
import { MongodbUtils } from "src/infrastructure/database/mongodb/mongodb.utils";

export type RolePermissionDocument = HydratedDocument<RolePermissionModel>;

export const RolePermissionSchema = SchemaFactory.createForClass(RolePermissionModel);

RolePermissionSchema.loadClass(RolePermissionModel);

MongodbUtils.customSchemaHooks({ schema: RolePermissionSchema });
