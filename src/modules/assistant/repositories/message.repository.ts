import { Injectable } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Connection, Model } from "mongoose";
import { DB_COLLECTION, DB_CONNECTION } from "../../../infrastructure/database/mongodb/constant";
import { BaseRepositoryAbstract } from "../../../infrastructure/repositories/abstract.repository";
import { Message } from "../models/message.model";

@Injectable()
export class MessageRepository extends BaseRepositoryAbstract<Message> {
  constructor(
    @InjectModel(DB_COLLECTION.MESSAGE, DB_CONNECTION.PLAYGROUND)
    readonly model: Model<Message>,

    @InjectConnection(DB_CONNECTION.PLAYGROUND)
    readonly connection: Connection,
  ) {
    super(model, connection);
  }
}
