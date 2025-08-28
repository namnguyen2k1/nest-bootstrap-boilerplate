import { User } from "@models/user.model";
import { PERMISSION_KEY } from "@role/models/permission.model";
import { ROLE_KEY } from "@role/models/role.model";
import { Request } from "express";

export interface AuthContext {
  roleKey: ROLE_KEY;
  user: User;
  permissions: PERMISSION_KEY[];
}

export interface AuthorizedRequest extends Request {
  authContext: AuthContext;
}
