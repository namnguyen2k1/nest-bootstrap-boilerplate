import { Role } from '@models/role.model';
import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { DB_COLLECTION, DB_CONNECTION } from '../database/mongodb/constant';
import { BaseRepositoryAbstract } from './abstract.repository';

@Injectable()
export class RoleRepository extends BaseRepositoryAbstract<Role> {
  constructor(
    @InjectModel(DB_COLLECTION.ROLE, DB_CONNECTION.PLAYGROUND)
    readonly model: Model<Role>,

    @InjectConnection(DB_CONNECTION.PLAYGROUND)
    readonly connection: Connection,
  ) {
    super(model, connection);
  }
}
