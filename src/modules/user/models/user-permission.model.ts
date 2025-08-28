import { Prop, Schema } from "@nestjs/mongoose";
import { Permission } from "@role/models/permission.model";
import { Types } from "mongoose";
import { DB_COLLECTION } from "../../../infrastructure/database/mongodb/constant";
import { BaseModel } from "../../../infrastructure/database/mongodb/models/base.model";
import { MongodbUtils } from "../../../infrastructure/database/mongodb/mongodb.utils";
import { User } from "./user.model";

@Schema(
  MongodbUtils.createSchemaOptions({
    collection: DB_COLLECTION.USER_PERMISSION,
  }),
)
export class UserPermission extends BaseModel {
  @Prop({
    type: Types.ObjectId,
    ref: DB_COLLECTION.USER,
    required: true,
  })
  userId: Types.ObjectId | User;

  @Prop({
    type: Types.ObjectId,
    ref: DB_COLLECTION.PERMISSION,
    required: true,
  })
  permissionId: Types.ObjectId | Permission;
}
