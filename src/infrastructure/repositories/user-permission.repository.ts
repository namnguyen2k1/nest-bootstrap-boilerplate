import { UserPermission } from '@models/user-permission.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DB_COLLECTION, DB_CONNECTION } from '../database/mongodb/constant';
import { BaseRepositoryAbstract } from './abstract.repository';

@Injectable()
export class UserPermissionRepository extends BaseRepositoryAbstract<UserPermission> {
  constructor(
    @InjectModel(DB_COLLECTION.USER_PERMISSION, DB_CONNECTION.PLAYGROUND)
    readonly model: Model<UserPermission>,
  ) {
    super(model);
  }
}
