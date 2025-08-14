import { RolePermission } from '@models/role-permission.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DB_COLLECTION, DB_CONNECTION } from '../database/mongodb/constant';
import { BaseRepositoryAbstract } from './abstract.repository';

@Injectable()
export class RolePermissionRepository extends BaseRepositoryAbstract<RolePermission> {
  constructor(
    @InjectModel(DB_COLLECTION.ROLE_PERMISSION, DB_CONNECTION.PLAYGROUND)
    readonly model: Model<RolePermission>,
  ) {
    super(model);
  }
}
