import { Permission } from "@models/permission.model";
import { SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { MongodbUtils } from "../mongodb.utils";

export type PermissionDocument = HydratedDocument<Permission>;

export const PermissionSchema = SchemaFactory.createForClass(Permission);

PermissionSchema.loadClass(Permission);

MongodbUtils.customSchemaHooks({ schema: PermissionSchema });
