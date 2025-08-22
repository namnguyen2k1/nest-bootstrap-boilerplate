import {
  AccessData,
  REQUIRED_ACCESS,
} from '@auth/decorators/required-access.decorator';
import { AUTH_ERROR } from '@auth/enum/auth-error-code.enum';
import { ROLE_KEY } from '@models/role.model';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthorizedRequest } from '../enum/authorized-request';

@Injectable()
export class RequiredAccessGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const requiredAccessData = this.reflector.getAllAndOverride<AccessData>(
      REQUIRED_ACCESS,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredAccessData) {
      return true;
    }

    const request: AuthorizedRequest = context.switchToHttp().getRequest();
    const { roleKey, permissions } = request.authContext;

    // 1. has admin role -> pass
    if (roleKey === ROLE_KEY.ADMIN) {
      return true;
    }

    // 2a. match one of roles
    let matchRoles = true;
    if (requiredAccessData.roles?.length) {
      matchRoles = requiredAccessData.roles.includes(roleKey);
    }
    // 2b. match all permissions
    let matchPermissions = true;
    if (requiredAccessData.permissions?.length) {
      matchPermissions = requiredAccessData.permissions.every((permission) =>
        permissions.includes(permission),
      );
    }

    if (!matchRoles && !matchPermissions) {
      throw new ForbiddenException({
        code: AUTH_ERROR.PERMISSION_DENIED,
        message: 'Access denied: insufficient role or permission',
      });
    }

    return true;
  }
}
