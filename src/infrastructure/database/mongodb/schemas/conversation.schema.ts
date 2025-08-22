import { Conversation } from "@models/conversation.model";
import { SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { MongodbUtils } from "../mongodb.utils";

export type ConversationDocument = HydratedDocument<Conversation>;

export const ConversationSchema = SchemaFactory.createForClass(Conversation);

ConversationSchema.loadClass(Conversation);

MongodbUtils.customSchemaHooks({ schema: ConversationSchema });
