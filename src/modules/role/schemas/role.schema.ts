import { SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { MongodbUtils } from "../../../infrastructure/database/mongodb/mongodb.utils";
import { RoleModel } from "../models/role.model";

export type RoleDocument = HydratedDocument<RoleModel>;

export const RoleSchema = SchemaFactory.createForClass(RoleModel);

RoleSchema.loadClass(RoleModel);

MongodbUtils.customSchemaHooks({ schema: RoleSchema });
