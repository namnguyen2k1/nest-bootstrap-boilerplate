import { SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { MongodbUtils } from "../../../infrastructure/database/mongodb/mongodb.utils";
import { ConversationModel } from "../models/conversation.model";

export type ConversationDocument = HydratedDocument<ConversationModel>;

export const ConversationSchema = SchemaFactory.createForClass(ConversationModel);

ConversationSchema.loadClass(ConversationModel);

MongodbUtils.customSchemaHooks({ schema: ConversationSchema });
