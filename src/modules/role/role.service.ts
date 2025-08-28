import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PermissionRepository } from "@role/repositories/permission.repository";
import { RolePermissionRepository } from "@role/repositories/role-permission.repository";
import { RoleRepository } from "@role/repositories/role.repository";
import { logObj } from "@shared/utils/log-obj";
import { parsePaging } from "@shared/utils/parse-paging";
import { toObjectId } from "@shared/utils/to-object-id";
import { FilterQuery } from "mongoose";
import { CachingService } from "src/cache/caching.service";
import { Permission, PERMISSION_KEY } from "./models/permission.model";
import { Role, ROLE_KEY, ROLE_STATUS } from "./models/role.model";
import { CreateRoleBodyDTO, GetRolesBodyDTO, UpdateRoleBodyDTO } from "./role.dto";
import { buildRoleWithPermissionPipeline } from "./role.pipeline";

@Injectable()
export class RoleService {
  constructor(
    private readonly cacheService: CachingService,
    private readonly roleRepo: RoleRepository,
    private readonly permissionRepo: PermissionRepository,
    private readonly rolePermissionRepo: RolePermissionRepository,
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
      throw new NotFoundException(`Role ${logObj(filter)} not found`);
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

  async findPermissionByKey(key: PERMISSION_KEY) {
    return await this.permissionRepo.findOne({ key });
  }

  async checkAndInitialDatabase() {
    const permissionKeys = Object.values(PERMISSION_KEY);
    const data = {
      role: [
        {
          key: ROLE_KEY.ADMIN,
          description: "This is role admin",
          maxDeviceLogin: 1000,
        },
        {
          key: ROLE_KEY.CLIENT,
          description: "This is role client",
          maxDeviceLogin: 2,
        },
      ] as Role[],
      permissions: [
        ...permissionKeys.map((key) => {
          return {
            key: key,
            description: `description of ${key} permission`,
          } as Permission;
        }),
      ],
      rolePermissions: {
        admin: {
          roleKey: ROLE_KEY.ADMIN,
          permissions: [
            PERMISSION_KEY.USER_READ,
            PERMISSION_KEY.USER_CREATE,
            PERMISSION_KEY.USER_UPDATE,
            PERMISSION_KEY.USER_DELETE,
            PERMISSION_KEY.ROLE_READ,
            PERMISSION_KEY.ROLE_CREATE,
            PERMISSION_KEY.ROLE_UPDATE,
            PERMISSION_KEY.ROLE_DELETE,
            PERMISSION_KEY.POST_READ,
            PERMISSION_KEY.POST_CREATE,
            PERMISSION_KEY.POST_UPDATE,
            PERMISSION_KEY.POST_DELETE,
          ],
        },
        client: {
          roleKey: ROLE_KEY.CLIENT,
          permissions: [PERMISSION_KEY.POST_READ, PERMISSION_KEY.POST_CREATE],
        },
      },
    };

    await this.initialRoleData(data.role);
    await this.initialPermissionData(data.permissions);
    await this.initialRolePermissionData(data.rolePermissions.admin);
    await this.initialRolePermissionData(data.rolePermissions.client);
  }

  async initialRoleData(roles: Partial<Role>[]) {
    const existedRoles = await this.roleRepo.count({
      deletedAt: null,
    });

    if (existedRoles > 0) {
      return;
    }

    const promises: Promise<any>[] = [];
    for (const item of roles) {
      promises.push(this.roleRepo.create(item));
    }
    await Promise.allSettled(promises).then((result) => {
      console.log("[database] initial role data", result);
    });
  }

  async initialPermissionData(permissions: Partial<Permission>[]) {
    const existedPermissions = await this.permissionRepo.count({
      deletedAt: null,
    });

    if (existedPermissions > 0) {
      return;
    }

    const promises: Promise<any>[] = [];
    for (const item of permissions) {
      promises.push(this.permissionRepo.create(item));
    }
    await Promise.allSettled(promises).then((result) => {
      console.log("[database] initial permission data", result);
    });
  }

  async initialRolePermissionData(payload: { roleKey: ROLE_KEY; permissions: PERMISSION_KEY[] }) {
    const role = await this.roleRepo.findOne({
      key: payload.roleKey,
    });
    if (!role) {
      return;
    }
    const roleId = toObjectId(role.id);
    const existedRolePermissions = await this.rolePermissionRepo.count({
      roleId: roleId,
    });
    if (existedRolePermissions > 0) {
      return;
    }
    const permission = await this.permissionRepo.findAll({
      key: { $in: payload.permissions },
    });
    const permissionIds = permission.map((p) => p.id);
    if (!permissionIds.length) {
      return;
    }
    const promises: Promise<any>[] = [];
    for (const permissionId of permissionIds) {
      promises.push(
        this.rolePermissionRepo.create({
          roleId: roleId,
          permissionId: toObjectId(permissionId),
        }),
      );
    }
    await Promise.allSettled(promises).then((result) => {
      console.log(`[database] initial role permission ${payload.roleKey} data`, result);
    });
  }
}
