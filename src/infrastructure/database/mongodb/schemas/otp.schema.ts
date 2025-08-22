import { OTP } from "@models/otp.model";
import { SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { MongodbUtils } from "../mongodb.utils";

export type OTPDocument = HydratedDocument<OTP>;

export const OTPSchema = SchemaFactory.createForClass(OTP);

OTPSchema.loadClass(OTP);

MongodbUtils.customSchemaHooks({ schema: OTPSchema });
