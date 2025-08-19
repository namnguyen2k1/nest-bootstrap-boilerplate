import { Token } from '@models/token.model';
import { SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { MongodbUtils } from '../mongodb.utils';

export type TokenDocument = HydratedDocument<Token>;

export const TokenSchema = SchemaFactory.createForClass(Token);

TokenSchema.loadClass(Token);

MongodbUtils.customSchemaHooks({ schema: TokenSchema });
