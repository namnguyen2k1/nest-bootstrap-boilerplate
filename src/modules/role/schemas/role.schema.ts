import { SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { MongodbUtils } from "../../../infrastructure/database/mongodb/mongodb.utils";
import { Role } from "../models/role.model";

export type RoleDocument = HydratedDocument<Role>;

export const RoleSchema = SchemaFactory.createForClass(Role);

RoleSchema.loadClass(Role);

MongodbUtils.customSchemaHooks({ schema: RoleSchema });
