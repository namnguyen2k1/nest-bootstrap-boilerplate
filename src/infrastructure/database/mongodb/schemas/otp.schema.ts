import { OTP } from '@models/otp.model';
import { SchemaFactory } from '@nestjs/mongoose';
import { MongodbUtils } from '../mongodb.utils';

export const OTPSchema = SchemaFactory.createForClass(OTP);

OTPSchema.loadClass(OTP);

MongodbUtils.customSchemaHooks({ schema: OTPSchema });
