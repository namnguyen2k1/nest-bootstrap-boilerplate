import { PERMISSION_KEY } from '@models/permission.model';
import { ROLE_KEY, ROLE_STATUS, Role } from '@models/role.model';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RoleRepository } from '@repositories/role.repository';
import { parsePaging } from '@shared/utils/parse-paging';
import { toObjectId } from '@shared/utils/to-object-id';
import { FilterQuery } from 'mongoose';
import { CachingService } from 'src/cache/caching.service';
import { inspect } from 'util';
import {
  CreateRoleBodyDTO,
  GetRolesBodyDTO,
  UpdateRoleBodyDTO,
} from './role.dto';
import { buildRoleWithPermissionPipeline } from './role.pipeline';

@Injectable()
export class RoleService {
  constructor(
    private readonly roleRepo: RoleRepository,
    private readonly cacheService: CachingService,
  ) {}

  get roleModel() {
    return this.roleRepo.model;
  }

  async getRoleId(name: ROLE_KEY) {
    const key: string = this.cacheService.keyFactory.roleByName(name);
    const cached = await this.cacheService.get<Role>(key);
    if (cached) return toObjectId(cached.id);

    const role = await this.roleRepo.findOne({ key: name });
    this.cacheService.set(key, role);
    if (!role) {
      throw new NotFoundException(`Role ${name} not found`);
    }
    return toObjectId(role.id);
  }

  async checkExisted(filter: FilterQuery<Role>) {
    const role = await this.roleRepo.findOne(filter);
    if (!role) {
      throw new NotFoundException(`Role ${inspect(filter)} not found`);
    }
    return role;
  }

  async findAllRoles(dto: GetRolesBodyDTO) {
    const count: number = await this.roleRepo.count({
      deletedAt: null,
      status: ROLE_STATUS.ACTIVE,
    });
    const { sort, limit, offset } = parsePaging(dto);
    const pipeline = buildRoleWithPermissionPipeline({
      match: {
        status: ROLE_STATUS.ACTIVE,
      },
      limit,
      skip: offset,
      sort,
    });
    const roles = (await this.roleModel.aggregate(pipeline)) as Role &
      {
        permissions: string[];
      }[];

    return {
      count: count,
      data: roles,
    };
  }

  async findById(roleId: string): Promise<
    Role & {
      permissions: PERMISSION_KEY[];
    }
  > {
    await this.checkExisted({ _id: roleId });
    const pipeline = buildRoleWithPermissionPipeline({
      match: {
        _id: toObjectId(roleId),
      },
    });
    const role = await this.roleModel.aggregate(pipeline);
    return role[0];
  }

  async create(data: CreateRoleBodyDTO) {
    const role = await this.roleRepo.findOne({ key: data.name });
    if (role) {
      throw new ConflictException(`Existed Role ${data.name}`);
    }
    return await this.roleRepo.create(data);
  }

  async updateOne(payload: { roleId: string; data: UpdateRoleBodyDTO }) {
    await this.checkExisted({ id: payload.roleId });
    return await this.roleRepo.updateOne({ id: payload.roleId }, payload.data);
  }

  async removeOne(roleId: string) {
    await this.checkExisted({ id: roleId });
    await this.roleRepo.removeOne({ id: roleId });
  }
}
