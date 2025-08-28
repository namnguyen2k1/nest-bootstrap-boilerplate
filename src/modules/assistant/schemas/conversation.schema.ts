import { SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { MongodbUtils } from "../../../infrastructure/database/mongodb/mongodb.utils";
import { Conversation } from "../models/conversation.model";

export type ConversationDocument = HydratedDocument<Conversation>;

export const ConversationSchema = SchemaFactory.createForClass(Conversation);

ConversationSchema.loadClass(Conversation);

MongodbUtils.customSchemaHooks({ schema: ConversationSchema });
