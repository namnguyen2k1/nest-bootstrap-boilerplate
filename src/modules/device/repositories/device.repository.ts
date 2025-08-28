import { Device } from "@device/models/device.model";
import { Injectable } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Connection, Model } from "mongoose";
import { DB_COLLECTION, DB_CONNECTION } from "../../../infrastructure/database/mongodb/constant";
import { BaseRepositoryAbstract } from "../../../infrastructure/repositories/abstract.repository";

@Injectable()
export class DeviceRepository extends BaseRepositoryAbstract<Device> {
  constructor(
    @InjectModel(DB_COLLECTION.DEVICE, DB_CONNECTION.PLAYGROUND)
    readonly model: Model<Device>,

    @InjectConnection(DB_CONNECTION.PLAYGROUND)
    readonly connection: Connection,
  ) {
    super(model, connection);
  }
}
