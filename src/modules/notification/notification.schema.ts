import { SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { MongodbUtils } from "../../infrastructure/database/mongodb/mongodb.utils";
import { NotificationModel } from "./notification.model";

export type NotificationDocument = HydratedDocument<NotificationModel>;

export const NotificationSchema = SchemaFactory.createForClass(NotificationModel);

NotificationSchema.loadClass(NotificationModel);

MongodbUtils.customSchemaHooks({ schema: NotificationSchema });
