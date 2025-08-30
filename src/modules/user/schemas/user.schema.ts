import { SchemaFactory } from "@nestjs/mongoose";
import { UserModel } from "@user/models/user.model";
import { HydratedDocument } from "mongoose";
import { MongodbUtils } from "src/infrastructure/database/mongodb/mongodb.utils";

export type UserDocument = HydratedDocument<UserModel>;

export const UserSchema = SchemaFactory.createForClass(UserModel);

UserSchema.loadClass(UserModel);

MongodbUtils.customSchemaHooks({ schema: UserSchema });
