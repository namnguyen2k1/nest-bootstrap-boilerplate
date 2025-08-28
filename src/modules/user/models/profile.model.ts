import { BaseModel } from "@models/base.model";
import { Prop, Schema } from "@nestjs/mongoose";
import { User } from "@user/models/user.model";
import { IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";
import { DB_COLLECTION } from "src/infrastructure/database/mongodb/constant";
import { MongodbUtils } from "src/infrastructure/database/mongodb/mongodb.utils";

@Schema(
  MongodbUtils.createSchemaOptions({
    collection: DB_COLLECTION.PROFILE,
  }),
)
export class Profile extends BaseModel {
  @Prop({
    type: Types.ObjectId,
    ref: DB_COLLECTION.USER,
    required: true,
  })
  userId: Types.ObjectId | User;

  @Prop({ required: true })
  @IsString()
  avatarUrl: string;

  @Prop({})
  @IsString()
  @IsOptional()
  coverUrl?: string;
}
