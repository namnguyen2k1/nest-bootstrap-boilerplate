import { Injectable } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { RolePermission } from "@role/models/role-permission.model";
import { Connection, Model } from "mongoose";
import { DB_COLLECTION, DB_CONNECTION } from "../../../infrastructure/database/mongodb/constant";
import { BaseRepositoryAbstract } from "../../../infrastructure/repositories/abstract.repository";

@Injectable()
export class RolePermissionRepository extends BaseRepositoryAbstract<RolePermission> {
  constructor(
    @InjectModel(DB_COLLECTION.ROLE_PERMISSION, DB_CONNECTION.PLAYGROUND)
    readonly model: Model<RolePermission>,

    @InjectConnection(DB_CONNECTION.PLAYGROUND)
    readonly connection: Connection,
  ) {
    super(model, connection);
  }
}
