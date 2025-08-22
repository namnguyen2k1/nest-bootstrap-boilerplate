import { Permission, PERMISSION_KEY } from "@models/permission.model";
import { Role, ROLE_KEY } from "@models/role.model";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { PermissionRepository } from "@repositories/permission.repository";
import { RolePermissionRepository } from "@repositories/role-permission.repository";
import { RoleRepository } from "@repositories/role.repository";
import { toObjectId } from "@shared/utils/to-object-id";
import appConfig from "./config/app.config";

@Injectable()
export class AppService {
  constructor(
    @Inject(appConfig.KEY)
    private readonly app: ConfigType<typeof appConfig>,

    private readonly roleRepo: RoleRepository,
    private readonly permissionRepo: PermissionRepository,
    private readonly rolePermissionRepo: RolePermissionRepository,
  ) {}

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
