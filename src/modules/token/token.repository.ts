import { Injectable } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { BaseRepositoryAbstract } from "@repositories/abstract.repository";
import { Token } from "@token/token.model";
import { Connection, Model } from "mongoose";
import { DB_COLLECTION, DB_CONNECTION } from "src/infrastructure/database/mongodb/constant";

@Injectable()
export class TokenRepository extends BaseRepositoryAbstract<Token> {
  constructor(
    @InjectModel(DB_COLLECTION.TOKEN, DB_CONNECTION.PLAYGROUND)
    readonly model: Model<Token>,

    @InjectConnection(DB_CONNECTION.PLAYGROUND)
    readonly connection: Connection,
  ) {
    super(model, connection);
  }
}
