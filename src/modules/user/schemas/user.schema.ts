import { SchemaFactory } from "@nestjs/mongoose";
import { User } from "@user/models/user.model";
import { HydratedDocument } from "mongoose";
import { MongodbUtils } from "src/infrastructure/database/mongodb/mongodb.utils";

export type UserDocument = HydratedDocument<User>;

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.loadClass(User);

MongodbUtils.customSchemaHooks({ schema: UserSchema });
