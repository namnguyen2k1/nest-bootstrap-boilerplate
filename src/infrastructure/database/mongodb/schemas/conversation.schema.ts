import { Conversation } from '@models/conversation.model';
import { SchemaFactory } from '@nestjs/mongoose';
import { MongodbUtils } from '../mongodb.utils';

export const ConversationSchema = SchemaFactory.createForClass(Conversation);

ConversationSchema.loadClass(Conversation);

MongodbUtils.customSchemaHooks({ schema: ConversationSchema });
