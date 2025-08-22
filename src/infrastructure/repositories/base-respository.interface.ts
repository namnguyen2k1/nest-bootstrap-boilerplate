import { FilterQuery, QueryOptions } from "mongoose";

export type FindAllData<T> = {
  readonly count: number;
  readonly data: T[];
};

export interface BaseRepositoryInterface<T> {
  create(data: T | any): Promise<T>;
  createOrUpdateIfExisted(filter: FilterQuery<T>, data: Partial<T>): Promise<T>;
  findOne(filter?: FilterQuery<T>, options?: QueryOptions<T>): Promise<T | null>;
  findAll(filter: FilterQuery<T>, options?: QueryOptions<T>): Promise<T[]>;
  count(filter: FilterQuery<T>): Promise<number>;
  findAllPaging(filter: FilterQuery<T>, options?: QueryOptions<T>): Promise<FindAllData<T>>;
  updateOne(filter: FilterQuery<T>, data: Partial<T>): Promise<T | null>;
  removeOne(filter: FilterQuery<T>, data?: Partial<T>): Promise<boolean>;
  deleteOne(filter: FilterQuery<T>): Promise<boolean>;
}
