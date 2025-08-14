import { Token } from '@models/token.model';
import { SchemaFactory } from '@nestjs/mongoose';
import { MongodbUtils } from '../mongodb.utils';

export const TokenSchema = SchemaFactory.createForClass(Token);

TokenSchema.loadClass(Token);

MongodbUtils.customSchemaHooks({ schema: TokenSchema });
