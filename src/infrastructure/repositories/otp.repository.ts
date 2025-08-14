import { OTP } from '@models/otp.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DB_COLLECTION, DB_CONNECTION } from '../database/mongodb/constant';
import { BaseRepositoryAbstract } from './abstract.repository';

@Injectable()
export class OTPRepository extends BaseRepositoryAbstract<OTP> {
  constructor(
    @InjectModel(DB_COLLECTION.OTP, DB_CONNECTION.PLAYGROUND)
    readonly model: Model<OTP>,
  ) {
    super(model);
  }
}
