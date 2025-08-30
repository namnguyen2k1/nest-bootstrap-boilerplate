import { Injectable } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Connection, Model } from "mongoose";
import { DB_COLLECTION, DB_CONNECTION } from "../../infrastructure/database/mongodb/constant";
import { BaseRepositoryAbstract } from "../../infrastructure/repositories/abstract.repository";
import { NotificationModel } from "./notification.model";

@Injectable()
export class NotificationRepository extends BaseRepositoryAbstract<NotificationModel> {
  constructor(
    @InjectModel(DB_COLLECTION.NOTIFICATION, DB_CONNECTION.PLAYGROUND)
    readonly model: Model<NotificationModel>,

    @InjectConnection(DB_CONNECTION.PLAYGROUND)
    readonly connection: Connection,
  ) {
    super(model, connection);
  }
}
