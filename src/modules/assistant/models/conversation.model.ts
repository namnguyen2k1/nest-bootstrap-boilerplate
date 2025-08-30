import { BaseModel, BaseMongodbType } from "@models/base.model";
import { Prop, Schema } from "@nestjs/mongoose";
import { User } from "@user/models/user.model";
import { IsString } from "class-validator";
import { Types } from "mongoose";
import { DB_COLLECTION } from "src/infrastructure/database/mongodb/constant";
import { MongodbUtils } from "src/infrastructure/database/mongodb/mongodb.utils";

export interface Conversation extends BaseMongodbType {
  userId: Types.ObjectId | User;
  name: string;
}

@Schema(
  MongodbUtils.createSchemaOptions({
    collection: DB_COLLECTION.CONVERSATION,
  }),
)
export class ConversationModel extends BaseModel implements Conversation {
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
