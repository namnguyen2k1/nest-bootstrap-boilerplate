import { Conversation } from "@models/conversation.model";
import { Injectable } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Connection, Model } from "mongoose";
import { DB_COLLECTION, DB_CONNECTION } from "../database/mongodb/constant";
import { BaseRepositoryAbstract } from "./abstract.repository";

@Injectable()
export class ConversationRepository extends BaseRepositoryAbstract<Conversation> {
  constructor(
    @InjectModel(DB_COLLECTION.CONVERSATION, DB_CONNECTION.PLAYGROUND)
    readonly model: Model<Conversation>,

    @InjectConnection(DB_CONNECTION.PLAYGROUND)
    readonly connection: Connection,
  ) {
    super(model, connection);
  }
}
