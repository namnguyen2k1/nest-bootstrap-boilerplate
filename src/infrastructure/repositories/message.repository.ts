import { Message } from '@models/message.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DB_COLLECTION, DB_CONNECTION } from '../database/mongodb/constant';
import { BaseRepositoryAbstract } from './abstract.repository';

@Injectable()
export class MessageRepository extends BaseRepositoryAbstract<Message> {
  constructor(
    @InjectModel(DB_COLLECTION.MESSAGE, DB_CONNECTION.PLAYGROUND)
    readonly model: Model<Message>,
  ) {
    super(model);
  }
}
