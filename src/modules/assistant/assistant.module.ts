import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { OpenAIModule } from "@open-ai/open-ai.module";
import { UserModule } from "@user/user.module";
import { DB_COLLECTION, DB_CONNECTION } from "src/infrastructure/database/mongodb/constant";
import { MongodbModule } from "src/infrastructure/database/mongodb/mongodb.module";
import { AssistantController } from "./assistant.controller";
import { ConversationRepository } from "./repositories/conversation.repository";
import { MessageRepository } from "./repositories/message.repository";
import { ConversationSchema } from "./schemas/conversation.schema";
import { MessageSchema } from "./schemas/message.schema";
import { ConversationService } from "./services/conversation.service";
import { MessageService } from "./services/message.service";
import { ToolCallService } from "./services/tool-call.service";

@Module({
  imports: [
    MongodbModule,
    OpenAIModule,
    UserModule,
    MongooseModule.forFeature(
      [
        {
          name: DB_COLLECTION.CONVERSATION,
          schema: ConversationSchema,
        },
        {
          name: DB_COLLECTION.MESSAGE,
          schema: MessageSchema,
        },
      ],
      DB_CONNECTION.PLAYGROUND,
    ),
  ],
  controllers: [AssistantController],
  providers: [
    ConversationRepository,
    MessageRepository,
    ToolCallService,
    MessageService,
    ConversationService,
  ],
  exports: [MessageService, ConversationService],
})
export class AssistantModule {}
