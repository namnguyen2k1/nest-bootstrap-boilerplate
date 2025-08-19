import { Prop } from '@nestjs/mongoose';
import { IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export abstract class BaseModel {
  _id: Types.ObjectId;
  id: string;

  @Prop()
  @IsOptional()
  deletedAt?: Date;

  @Prop({ default: Date.now() })
  createdAt: Date;

  @Prop({ default: Date.now() })
  updatedAt: Date;
}
