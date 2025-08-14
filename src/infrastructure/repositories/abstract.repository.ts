import { toObjectId } from '@shared/utils/to-object-id';
import { FilterQuery, Model, QueryOptions } from 'mongoose';
import {
  BaseRepositoryInterface,
  FindAllData,
} from './base-respository.interface';
import { BaseEntity } from './base.entity';

export abstract class BaseRepositoryAbstract<T extends BaseEntity>
  implements BaseRepositoryInterface<T>
{
  protected constructor(private readonly _model: Model<T>) {
    this._model = _model;
  }

  private mapFilter(filter: FilterQuery<T>) {
    const { id, ..._filter } = filter;
    return {
      deletedAt: null,
      ..._filter,
      ...(id && { _id: toObjectId(id) }),
    };
  }

  async create(data: Partial<T>): Promise<T> {
    const result = await this._model.create(data);
    return result.toObject();
  }

  async createOrUpdateIfExisted(
    filter: FilterQuery<T>,
    data: Partial<T>,
  ): Promise<T> {
    const _filter = this.mapFilter(filter);
    const existed = await this._model.findOne(_filter);
    if (existed) {
      const updated = await this._model
        .findOneAndUpdate(_filter, data, {
          new: true,
        })
        .exec();
      return updated?.toObject()!;
    }
    const created = await this._model.create(data);
    return created.toObject();
  }

  async findOne(
    filter: FilterQuery<T>,
    options?: QueryOptions<T>,
  ): Promise<T | null> {
    const _filter = this.mapFilter(filter);
    let query = this._model.findOne(_filter, options?.projection);
    if (options?.populate) {
      query = query.populate(options.populate as string[] | string);
    }
    const doc = await query.exec();
    return doc ? doc.toObject() : null;
  }

  async findAll(
    filter: FilterQuery<T>,
    options?: QueryOptions<T>,
  ): Promise<T[]> {
    const _filter = this.mapFilter(filter);
    let query = this._model.find(_filter, options?.projection, options);
    if (options?.populate) {
      query = query.populate(options.populate as string[] | string);
    }
    return (await query.exec()).map((m) => m.toObject());
  }

  async count(filter: FilterQuery<T>): Promise<number> {
    const _filter = this.mapFilter(filter);
    const count = await this._model.countDocuments(_filter).exec();
    return count;
  }

  async findAllPaging(
    filter: FilterQuery<T>,
    options?: QueryOptions<T>,
  ): Promise<FindAllData<T>> {
    const _filter = this.mapFilter(filter);
    const [count, data] = await Promise.all([
      this.count(_filter),
      this.findAll(_filter, options),
    ]);
    return {
      count,
      data,
    };
  }

  async updateOne(filter: FilterQuery<T>, data: Partial<T>): Promise<T | null> {
    const _filter = this.mapFilter(filter);
    const result = await this._model
      .findOneAndUpdate(_filter, data, {
        new: true,
      })
      .exec();
    return result ? result.toObject() : null;
  }

  async removeOne(filter: FilterQuery<T>, data?: Partial<T>): Promise<boolean> {
    const _filter = this.mapFilter(filter);
    const result = await this._model
      .findOneAndUpdate<T>(_filter, {
        ...(data && data),
        deletedAt: new Date(),
      })
      .exec();
    return !!result;
  }

  async deleteOne(filter: FilterQuery<T>): Promise<boolean> {
    const { id, ..._filter } = filter;
    const result = await this._model
      .findOneAndDelete({
        ..._filter,
        ...(id && { _id: id }),
      })
      .exec();
    return !!result;
  }
}
