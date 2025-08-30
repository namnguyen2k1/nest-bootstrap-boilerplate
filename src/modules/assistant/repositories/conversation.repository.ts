import { Injectable } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Connection, Model } from "mongoose";
import { DB_COLLECTION, DB_CONNECTION } from "../../../infrastructure/database/mongodb/constant";
import { BaseRepositoryAbstract } from "../../../infrastructure/repositories/abstract.repository";
import { ConversationModel } from "../models/conversation.model";

@Injectable()
export class ConversationRepository extends BaseRepositoryAbstract<ConversationModel> {
  constructor(
    @InjectModel(DB_COLLECTION.CONVERSATION, DB_CONNECTION.PLAYGROUND)
    readonly model: Model<ConversationModel>,

    @InjectConnection(DB_CONNECTION.PLAYGROUND)
    readonly connection: Connection,
  ) {
    super(model, connection);
  }
}
