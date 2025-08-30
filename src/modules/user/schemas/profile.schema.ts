import { SchemaFactory } from "@nestjs/mongoose";
import { ProfileModel } from "@user/models/profile.model";
import { HydratedDocument } from "mongoose";
import { MongodbUtils } from "../../../infrastructure/database/mongodb/mongodb.utils";

export type ProfileDocument = HydratedDocument<ProfileModel>;

export const ProfileSchema = SchemaFactory.createForClass(ProfileModel);

ProfileSchema.loadClass(ProfileModel);

MongodbUtils.customSchemaHooks({ schema: ProfileSchema });
