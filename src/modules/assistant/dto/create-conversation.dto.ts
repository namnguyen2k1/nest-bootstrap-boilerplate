import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateConversationDto {
  @ApiProperty({
    description: 'The name of the conversation',
    example: 'My first chat',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The ID of the user who owns this conversation',
    example: '64e3d92f8a3240c1f9fbc123',
  })
  @IsString()
  userId: string;
}
