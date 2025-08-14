import { PERMISSION_KEY } from '@models/permission.model';
import { ROLE_KEY } from '@models/role.model';
import { SetMetadata } from '@nestjs/common';

export interface AccessData {
  readonly roles: ROLE_KEY[];
  readonly permissions: PERMISSION_KEY[];
}

export const REQUIRED_ACCESS = 'REQUIRED_ACCESS';
export function RequiredAccess(data: AccessData) {
  return SetMetadata(REQUIRED_ACCESS, data);
}
