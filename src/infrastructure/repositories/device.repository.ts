import { Device } from '@models/device.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DB_COLLECTION, DB_CONNECTION } from '../database/mongodb/constant';
import { BaseRepositoryAbstract } from './abstract.repository';

@Injectable()
export class DeviceRepository extends BaseRepositoryAbstract<Device> {
  constructor(
    @InjectModel(DB_COLLECTION.DEVICE, DB_CONNECTION.PLAYGROUND)
    readonly model: Model<Device>,
  ) {
    super(model);
  }
}
