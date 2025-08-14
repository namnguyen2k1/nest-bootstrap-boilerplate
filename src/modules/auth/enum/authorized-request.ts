import { PERMISSION_KEY } from '@models/permission.model';
import { ROLE_KEY } from '@models/role.model';
import { User } from '@models/user.model';
import { Request } from 'express';

export interface AuthContext {
  roleKey: ROLE_KEY;
  user: User;
  permissions: PERMISSION_KEY[];
}

export interface AuthorizedRequest extends Request {
  authContext: AuthContext;
}
