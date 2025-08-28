import { Injectable } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Profile } from "@user/models/profile.model";
import { Connection, Model } from "mongoose";
import { DB_COLLECTION, DB_CONNECTION } from "../../../infrastructure/database/mongodb/constant";
import { BaseRepositoryAbstract } from "../../../infrastructure/repositories/abstract.repository";

@Injectable()
export class ProfileRepository extends BaseRepositoryAbstract<Profile> {
  constructor(
    @InjectModel(DB_COLLECTION.PROFILE, DB_CONNECTION.PLAYGROUND)
    readonly model: Model<Profile>,

    @InjectConnection(DB_CONNECTION.PLAYGROUND)
    readonly connection: Connection,
  ) {
    super(model, connection);
  }
}
