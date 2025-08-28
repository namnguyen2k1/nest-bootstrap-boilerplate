import { SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { MongodbUtils } from "../../../infrastructure/database/mongodb/mongodb.utils";
import { Permission } from "../models/permission.model";

export type PermissionDocument = HydratedDocument<Permission>;

export const PermissionSchema = SchemaFactory.createForClass(Permission);

PermissionSchema.loadClass(Permission);

MongodbUtils.customSchemaHooks({ schema: PermissionSchema });
