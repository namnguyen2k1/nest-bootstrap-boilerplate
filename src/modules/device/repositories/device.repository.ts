import { DeviceModel } from "@device/models/device.model";
import { Injectable } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Connection, Model } from "mongoose";
import { DB_COLLECTION, DB_CONNECTION } from "../../../infrastructure/database/mongodb/constant";
import { BaseRepositoryAbstract } from "../../../infrastructure/repositories/abstract.repository";

@Injectable()
export class DeviceRepository extends BaseRepositoryAbstract<DeviceModel> {
  constructor(
    @InjectModel(DB_COLLECTION.DEVICE, DB_CONNECTION.PLAYGROUND)
    readonly model: Model<DeviceModel>,

    @InjectConnection(DB_CONNECTION.PLAYGROUND)
    readonly connection: Connection,
  ) {
    super(model, connection);
  }
}
