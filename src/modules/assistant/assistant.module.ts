import { Module } from '@nestjs/common';
import { OpenAIModule } from '@open-ai/open-ai.module';
import { UserModule } from '@user/user.module';
import { AssistantController } from './assistant.controller';
import { ConversationService } from './services/conversation.service';
import { MessageService } from './services/message.service';
import { ToolCallService } from './services/tool-call.service';

@Module({
  imports: [OpenAIModule, UserModule],
  controllers: [AssistantController],
  providers: [ToolCallService, MessageService, ConversationService],
})
export class AssistantModule {}
