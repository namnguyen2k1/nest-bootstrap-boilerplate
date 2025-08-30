import { Injectable } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { PermissionModel } from "@role/models/permission.model";
import { Connection, Model } from "mongoose";
import { DB_COLLECTION, DB_CONNECTION } from "../../../infrastructure/database/mongodb/constant";
import { BaseRepositoryAbstract } from "../../../infrastructure/repositories/abstract.repository";

@Injectable()
export class PermissionRepository extends BaseRepositoryAbstract<PermissionModel> {
  constructor(
    @InjectModel(DB_COLLECTION.PERMISSION, DB_CONNECTION.PLAYGROUND)
    readonly model: Model<PermissionModel>,

    @InjectConnection(DB_CONNECTION.PLAYGROUND)
    readonly connection: Connection,
  ) {
    super(model, connection);
  }
}
