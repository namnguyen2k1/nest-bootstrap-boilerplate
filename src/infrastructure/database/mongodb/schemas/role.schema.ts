import { Role } from "@models/role.model";
import { SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { MongodbUtils } from "../mongodb.utils";

export type RoleDocument = HydratedDocument<Role>;

export const RoleSchema = SchemaFactory.createForClass(Role);

RoleSchema.loadClass(Role);

MongodbUtils.customSchemaHooks({ schema: RoleSchema });
