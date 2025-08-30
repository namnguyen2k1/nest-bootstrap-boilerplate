import { SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { MongodbUtils } from "../../../infrastructure/database/mongodb/mongodb.utils";
import { MessageModel } from "../models/message.model";

export type MessageDocument = HydratedDocument<MessageModel>;

export const MessageSchema = SchemaFactory.createForClass(MessageModel);

MessageSchema.loadClass(MessageModel);

MongodbUtils.customSchemaHooks({ schema: MessageSchema });
