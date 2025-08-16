import { Conversation } from '@models/conversation.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DB_COLLECTION, DB_CONNECTION } from '../database/mongodb/constant';
import { BaseRepositoryAbstract } from './abstract.repository';

@Injectable()
export class ConversationRepository extends BaseRepositoryAbstract<Conversation> {
  constructor(
    @InjectModel(DB_COLLECTION.CONVERSATION, DB_CONNECTION.PLAYGROUND)
    readonly model: Model<Conversation>,
  ) {
    super(model);
  }
}
