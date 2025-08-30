import { BaseModel, BaseMongodbType } from "@models/base.model";
import { Prop, Schema } from "@nestjs/mongoose";
import { CHAT_MODEL, CHAT_ROLE } from "@open-ai/open-ai.type";
import { IsEnum, IsObject, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";
import { DB_COLLECTION } from "src/infrastructure/database/mongodb/constant";
import { MongodbUtils } from "src/infrastructure/database/mongodb/mongodb.utils";
import { Conversation } from "./conversation.model";

export interface Message extends BaseMongodbType {
  conversationId: Types.ObjectId | Conversation;
  role: CHAT_ROLE;
  model: CHAT_MODEL;
  content?: any;
  sessionId: number;
  chatCompletionId?: string;
  token?: {
    promptTokens?: number;
    promptTokensDetails?: any;
    completionTokens?: number;
    completionTokensDetails?: any;
    totalTokens?: number;
  };
  latencyMs?: number;
  finishReason?: string;
  toolCall?: {
    request: {
      id: string;
      type: "function";
      function: {
        name: string;
        arguments: string;
      };
    };
    response?: {
      data: Record<string, any>;
      latencyMs: number;
      status: "success" | "error" | "timeout";
    };
  };
  chatCompletion?: any;
}

@Schema(
  MongodbUtils.createSchemaOptions({
    collection: DB_COLLECTION.MESSAGE,
  }),
)
export class MessageModel extends BaseModel implements Message {
  @Prop({
    type: Types.ObjectId,
    ref: DB_COLLECTION.CONVERSATION,
    required: true,
  })
  conversationId: Types.ObjectId | Conversation;

  @Prop({
    type: String,
    enum: Object.values(CHAT_ROLE),
    required: true,
  })
  @IsEnum(CHAT_ROLE)
  role: CHAT_ROLE;

  @Prop({
    type: String,
    enum: Object.values(CHAT_MODEL),
    required: true,
  })
  @IsEnum(CHAT_MODEL)
  model: CHAT_MODEL;

  @Prop({
    type: Object,
  })
  @IsOptional()
  @IsObject()
  content?: any;

  @Prop({ required: true })
  @IsString()
  sessionId: number;

  @Prop()
  @IsOptional()
  @IsString()
  chatCompletionId?: string;

  @Prop({
    type: Object,
  })
  @IsOptional()
  token?: {
    promptTokens?: number;
    promptTokensDetails?: any;
    completionTokens?: number;
    completionTokensDetails?: any;
    totalTokens?: number;
  };

  @Prop()
  @IsOptional()
  latencyMs?: number;

  @Prop()
  @IsOptional()
  finishReason?: string;

  // tool_call
  @Prop({ type: Object })
  @IsOptional()
  toolCall?: {
    request: {
      id: string;
      type: "function";
      function: {
        name: string;
        arguments: string;
      };
    };
    response?: {
      data: Record<string, any>;
      latencyMs: number;
      status: "success" | "error" | "timeout";
    };
  };

  @Prop({ type: Object })
  @IsOptional()
  chatCompletion?: any;
}
