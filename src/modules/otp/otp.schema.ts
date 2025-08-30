import { SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { MongodbUtils } from "../../infrastructure/database/mongodb/mongodb.utils";
import { OTPModel } from "./otp.model";

export type OTPDocument = HydratedDocument<OTPModel>;

export const OTPSchema = SchemaFactory.createForClass(OTPModel);

OTPSchema.loadClass(OTPModel);

MongodbUtils.customSchemaHooks({ schema: OTPSchema });
