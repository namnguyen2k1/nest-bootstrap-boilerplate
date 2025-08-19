import { Message } from '@models/message.model';
import { SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { MongodbUtils } from '../mongodb.utils';

export type MessageDocument = HydratedDocument<Message>;

export const MessageSchema = SchemaFactory.createForClass(Message);

MessageSchema.loadClass(Message);

MongodbUtils.customSchemaHooks({ schema: MessageSchema });
