import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CHAT_MODEL } from '@open-ai/open-ai.type';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class AskAssistantDto {
  @ApiProperty({
    description: 'The ID of the conversation where the question belongs',
    example: '68a08aa8cbd7bddacf27ca1e',
  })
  @IsString()
  conversationId: string;

  @ApiPropertyOptional({
    description: 'The AI model to use for this request',
    enum: CHAT_MODEL,
    example: CHAT_MODEL.GPT_4O_MINI,
  })
  @IsOptional()
  @IsEnum(CHAT_MODEL)
  model?: CHAT_MODEL;

  @ApiProperty({
    description: 'The user question to ask the assistant',
    example: 'What is the difference between NestJS and Express?',
  })
  @IsString()
  question: string;
}
