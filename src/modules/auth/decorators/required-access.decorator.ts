import { SetMetadata } from "@nestjs/common";
import { PERMISSION_KEY } from "@role/models/permission.model";
import { ROLE_KEY } from "@role/models/role.model";

export interface AccessData {
  readonly roles: ROLE_KEY[];
  readonly permissions: PERMISSION_KEY[];
}

export const REQUIRED_ACCESS = "REQUIRED_ACCESS";
export function RequiredAccess(data: AccessData) {
  return SetMetadata(REQUIRED_ACCESS, data);
}
