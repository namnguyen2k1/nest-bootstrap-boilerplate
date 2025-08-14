import { Profile } from '@models/profile.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DB_COLLECTION, DB_CONNECTION } from '../database/mongodb/constant';
import { BaseRepositoryAbstract } from './abstract.repository';

@Injectable()
export class ProfileRepository extends BaseRepositoryAbstract<Profile> {
  constructor(
    @InjectModel(DB_COLLECTION.PROFILE, DB_CONNECTION.PLAYGROUND)
    readonly model: Model<Profile>,
  ) {
    super(model);
  }
}
