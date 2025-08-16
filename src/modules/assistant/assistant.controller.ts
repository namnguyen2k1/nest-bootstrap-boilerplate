import { PublicAPI } from '@auth/decorators/public-api.decorator';
import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PagingDTO } from '@shared/dto/paging.dto';
import { MongoIdPipe } from '@shared/pipes/mongoid.pipe';
import { AskAssistantDto } from './dto/ask-assistant.dto';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { ConversationService } from './services/conversation.service';
import { MessageService } from './services/message.service';

@Controller('assistant')
@ApiTags('assistant')
@PublicAPI()
export class AssistantController {
  constructor(
    private readonly messageService: MessageService,
    private readonly conversationService: ConversationService,
  ) {}

  @Post('conversations')
  async createConversation(@Body() body: CreateConversationDto) {
    const result = await this.conversationService.createConversation(body);
    return {
      _message: 'Create conversation successfully',
      data: result,
    };
  }

  @Post('conversations/user/:userId')
  async getListUserConversations(
    @Param('userId', MongoIdPipe) userId: string,
    @Body() body: PagingDTO,
  ) {
    const result = await this.conversationService.listUserConversation(
      userId,
      body,
    );
    return {
      _message: 'Get list conversations of user successfully',
      data: result,
    };
  }

  @Patch('conversations/:conversationId')
  async updateConversation(
    @Param('conversationId', MongoIdPipe) conversationId: string,
    @Body() body: { name: string },
  ) {
    await this.conversationService.updateConversation(conversationId, body);
    return {
      _message: 'Update conversation successfully',
    };
  }

  @Delete('conversations/:conversationId')
  async deleteConversation(
    @Param('conversationId', MongoIdPipe) conversationId: string,
  ) {
    await this.conversationService.deleteConversation(conversationId);
    return {
      _message: 'Delete conversation successfully',
    };
  }

  @Post('ask')
  async askAssistant(@Body() body: AskAssistantDto) {
    const result = await this.messageService.askAssistant(body);
    return {
      _message: 'Get answer from assistant successfully',
      data: result,
    };
  }
}
