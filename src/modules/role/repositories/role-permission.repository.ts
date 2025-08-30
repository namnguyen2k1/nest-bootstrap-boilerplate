import { Injectable } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { RolePermissionModel } from "@role/models/role-permission.model";
import { Connection, Model } from "mongoose";
import { DB_COLLECTION, DB_CONNECTION } from "../../../infrastructure/database/mongodb/constant";
import { BaseRepositoryAbstract } from "../../../infrastructure/repositories/abstract.repository";

@Injectable()
export class RolePermissionRepository extends BaseRepositoryAbstract<RolePermissionModel> {
  constructor(
    @InjectModel(DB_COLLECTION.ROLE_PERMISSION, DB_CONNECTION.PLAYGROUND)
    readonly model: Model<RolePermissionModel>,

    @InjectConnection(DB_CONNECTION.PLAYGROUND)
    readonly connection: Connection,
  ) {
    super(model, connection);
  }
}
