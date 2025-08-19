import { UserPermission } from '@models/user-permission.model';
import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { DB_COLLECTION, DB_CONNECTION } from '../database/mongodb/constant';
import { BaseRepositoryAbstract } from './abstract.repository';

@Injectable()
export class UserPermissionRepository extends BaseRepositoryAbstract<UserPermission> {
  constructor(
    @InjectModel(DB_COLLECTION.USER_PERMISSION, DB_CONNECTION.PLAYGROUND)
    readonly model: Model<UserPermission>,

    @InjectConnection(DB_CONNECTION.PLAYGROUND)
    readonly connection: Connection,
  ) {
    super(model, connection);
  }
}
