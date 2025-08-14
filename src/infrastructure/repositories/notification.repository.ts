import { Notification } from '@models/notification.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DB_COLLECTION, DB_CONNECTION } from '../database/mongodb/constant';
import { BaseRepositoryAbstract } from './abstract.repository';

@Injectable()
export class NotificationRepository extends BaseRepositoryAbstract<Notification> {
  constructor(
    @InjectModel(DB_COLLECTION.NOTIFICATION, DB_CONNECTION.PLAYGROUND)
    readonly model: Model<Notification>,
  ) {
    super(model);
  }
}
