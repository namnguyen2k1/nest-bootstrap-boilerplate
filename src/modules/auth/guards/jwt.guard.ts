import { AUTH_ERROR } from "@auth/enum/auth-error-code.enum";
import { AuthContext, AuthorizedRequest } from "@auth/enum/authorized-request";
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JsonWebTokenError, TokenExpiredError } from "@nestjs/jwt";
import { PERMISSION_KEY } from "@role/models/permission.model";
import { Role } from "@role/models/role.model";
import { RoleService } from "@role/role.service";
import { toStringSafe } from "@shared/utils/to-string-safe";
import { User } from "@user/models/user.model";
import { UserService } from "@user/user.service";
import { CachingService } from "src/cache/caching.service";
import { JsonWebTokenService } from "src/modules/token/services/json-web-token.service";
import { IS_PUBLIC_KEY } from "../decorators/public-api.decorator";

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jsonWebTokenService: JsonWebTokenService,
    private readonly cacheService: CachingService,

    private readonly userService: UserService,
    private readonly roleService: RoleService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. Check if the route is marked as public (no authentication required)
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    // 2. Extract the access token from the Authorization header
    const request: AuthorizedRequest = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request.headers.authorization);

    // 3. Verify the access token's validity and signature
    const { error, data } = await this.jsonWebTokenService.verifyToken(token, "access");
    if (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException("Token has expired");
      }
      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException("Invalid token");
      }
      throw error;
    }

    // 4. mapping auth data into request
    const { userId, deviceId } = data!;
    if (!userId || !deviceId) {
      throw new UnauthorizedException("Invalid token");
    }
    const user = await this.getCacheUser(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    const role = await this.getCacheRole(toStringSafe(user.roleId));

    request.authContext = {
      roleKey: role.key,
      user: user,
      permissions: role.permissions,
    } as AuthContext;

    return true;
  }

  private extractTokenFromHeader(authHeader?: string): string {
    if (!authHeader?.startsWith("Bearer ")) {
      throw new UnauthorizedException({
        code: AUTH_ERROR.TOKEN_INVALID,
        message: "Access token is required",
      });
    }
    return authHeader.split(" ")[1];
  }

  private async getCacheUser(userId: string) {
    const key = this.cacheService.keyFactory.userById(userId);
    const cached = await this.cacheService.get<User>(key);
    if (!cached) {
      const user = await this.userService.findById(userId);
      await this.cacheService.set(key, user);
      return user;
    }
    return cached;
  }

  private async getCacheRole(roleId: string) {
    const key = this.cacheService.keyFactory.roleById(roleId);
    const cached = await this.cacheService.get<
      Role & {
        permissions: PERMISSION_KEY[];
      }
    >(key);
    if (!cached) {
      const role = await this.roleService.findById(roleId);
      await this.cacheService.set(key, role);
      return role;
    }
    return cached;
  }
}
