import { SchemaFactory } from "@nestjs/mongoose";
import { Profile } from "@user/models/profile.model";
import { HydratedDocument } from "mongoose";
import { MongodbUtils } from "../../../infrastructure/database/mongodb/mongodb.utils";

export type ProfileDocument = HydratedDocument<Profile>;

export const ProfileSchema = SchemaFactory.createForClass(Profile);

ProfileSchema.loadClass(Profile);

MongodbUtils.customSchemaHooks({ schema: ProfileSchema });
