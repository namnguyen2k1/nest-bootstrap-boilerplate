import { LocationModel } from "@device/models/location.model";
import { Injectable } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Connection, Model } from "mongoose";
import { DB_COLLECTION, DB_CONNECTION } from "../../../infrastructure/database/mongodb/constant";
import { BaseRepositoryAbstract } from "../../../infrastructure/repositories/abstract.repository";

@Injectable()
export class LocationRepository extends BaseRepositoryAbstract<LocationModel> {
  constructor(
    @InjectModel(DB_COLLECTION.LOCATION, DB_CONNECTION.PLAYGROUND)
    readonly model: Model<LocationModel>,

    @InjectConnection(DB_CONNECTION.PLAYGROUND)
    readonly connection: Connection,
  ) {
    super(model, connection);
  }
}
