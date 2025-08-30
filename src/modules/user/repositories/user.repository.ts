import { Injectable } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { BaseRepositoryAbstract } from "@repositories/abstract.repository";
import { UserModel } from "@user/models/user.model";
import { Connection, Model } from "mongoose";
import { DB_COLLECTION, DB_CONNECTION } from "src/infrastructure/database/mongodb/constant";

@Injectable()
export class UserRepository extends BaseRepositoryAbstract<UserModel> {
  constructor(
    @InjectModel(DB_COLLECTION.USER, DB_CONNECTION.PLAYGROUND)
    readonly model: Model<UserModel>,

    @InjectConnection(DB_CONNECTION.PLAYGROUND)
    readonly connection: Connection,
  ) {
    super(model, connection);
  }
}
