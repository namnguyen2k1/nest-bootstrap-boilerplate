import { Prop, Schema } from "@nestjs/mongoose";
import { IsString } from "class-validator";
import { Types } from "mongoose";
import { DB_COLLECTION } from "../constant";
import { MongodbUtils } from "../mongodb.utils";
import { BaseModel } from "./base.model";
import { User } from "./user.model";

@Schema(
  MongodbUtils.createSchemaOptions({
    collection: DB_COLLECTION.CONVERSATION,
  }),
)
export class Conversation extends BaseModel {
  @Prop({
    type: Types.ObjectId,
    ref: DB_COLLECTION.USER,
    required: true,
  })
  userId: Types.ObjectId | User;

  @Prop({ required: true })
  @IsString()
  name: string;
}
