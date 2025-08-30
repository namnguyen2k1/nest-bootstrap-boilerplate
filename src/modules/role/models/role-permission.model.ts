import { Prop, Schema } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { DB_COLLECTION } from "../../../infrastructure/database/mongodb/constant";
import {
  BaseModel,
  BaseMongodbType,
} from "../../../infrastructure/database/mongodb/models/base.model";
import { MongodbUtils } from "../../../infrastructure/database/mongodb/mongodb.utils";
import { Permission } from "./permission.model";
import { Role } from "./role.model";

export interface RolePermission extends BaseMongodbType {
  roleId: Types.ObjectId | Role;
  permissionId: Types.ObjectId | Permission;
}

@Schema(
  MongodbUtils.createSchemaOptions({
    collection: DB_COLLECTION.ROLE_PERMISSION,
  }),
)
export class RolePermissionModel extends BaseModel implements RolePermission {
  @Prop({
    type: Types.ObjectId,
    ref: DB_COLLECTION.ROLE,
    required: true,
  })
  roleId: Types.ObjectId | Role;

  @Prop({
    type: Types.ObjectId,
    ref: DB_COLLECTION.PERMISSION,
    required: true,
  })
  permissionId: Types.ObjectId | Permission;
}
