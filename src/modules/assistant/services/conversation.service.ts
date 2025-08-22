import { Conversation } from "@models/conversation.model";
import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { ConversationRepository } from "@repositories/conversation.repository";
import { PagingDTO } from "@shared/dto/paging.dto";
import { toObjectId } from "@shared/utils/to-object-id";
import { UserService } from "@user/user.service";
import { CreateConversationDto } from "../dto/create-conversation.dto";

@Injectable()
export class ConversationService {
  constructor(
    private readonly conversationRepo: ConversationRepository,
    private readonly userService: UserService,
  ) {}

  async createConversation(dto: CreateConversationDto) {
    const user = await this.userService.findById(dto.userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    const conversations = await this.conversationRepo.findAll({
      userId: toObjectId(dto.userId),
    });
    if (conversations.length) {
      throw new ConflictException("Unable to create more conversations for this user");
    }

    return await this.conversationRepo.create({
      name: dto.name,
      userId: toObjectId(dto.userId),
    });
  }

  async listUserConversation(userId: string, paging: PagingDTO) {
    return await this.conversationRepo.findAllPaging(
      {
        userId: toObjectId(userId),
      },
      {
        projection: {
          name: 1,
          userId: 1,
        },
        populate: {
          path: "userId",
          select: {
            name: 1,
            email: 1,
          },
        },
        ...paging,
      },
    );
  }

  async updateConversation(conversationId: string, dto: Partial<Conversation>) {
    return await this.conversationRepo.updateOne({ id: conversationId }, dto);
  }

  async deleteConversation(conversationId: string) {
    return await this.conversationRepo.deleteOne({ id: conversationId });
  }
}
