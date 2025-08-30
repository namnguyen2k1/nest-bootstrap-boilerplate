import { Injectable } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Connection, Model } from "mongoose";
import { DB_COLLECTION, DB_CONNECTION } from "../../../infrastructure/database/mongodb/constant";
import { BaseRepositoryAbstract } from "../../../infrastructure/repositories/abstract.repository";
import { RoleModel } from "../models/role.model";

@Injectable()
export class RoleRepository extends BaseRepositoryAbstract<RoleModel> {
  constructor(
    @InjectModel(DB_COLLECTION.ROLE, DB_CONNECTION.PLAYGROUND)
    readonly model: Model<RoleModel>,

    @InjectConnection(DB_CONNECTION.PLAYGROUND)
    readonly connection: Connection,
  ) {
    super(model, connection);
  }
}
