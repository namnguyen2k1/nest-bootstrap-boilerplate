import { Injectable } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { BaseRepositoryAbstract } from "@repositories/abstract.repository";
import { UserPermission } from "@user/models/user-permission.model";
import { Connection, Model } from "mongoose";
import { DB_COLLECTION, DB_CONNECTION } from "src/infrastructure/database/mongodb/constant";

@Injectable()
export class UserPermissionRepository extends BaseRepositoryAbstract<UserPermission> {
  constructor(
    @InjectModel(DB_COLLECTION.USER_PERMISSION, DB_CONNECTION.PLAYGROUND)
    readonly model: Model<UserPermission>,

    @InjectConnection(DB_CONNECTION.PLAYGROUND)
    readonly connection: Connection,
  ) {
    super(model, connection);
  }
}
