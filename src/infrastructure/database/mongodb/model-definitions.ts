import { DB_COLLECTION } from "./constant";
import {
  ConversationSchema,
  DeviceSchema,
  LocationSchema,
  MessageSchema,
  NotificationSchema,
  OTPSchema,
  ProfileSchema,
  RolePermissionSchema,
  RoleSchema,
  TokenSchema,
  UserPermissionSchema,
  UserSchema,
} from "./schemas";
import { PermissionSchema } from "./schemas/permission.schema";

export const MODEL_DEFINITIONS = Object.values({
  role: {
    name: DB_COLLECTION.ROLE,
    schema: RoleSchema,
  },
  user: {
    name: DB_COLLECTION.USER,
    schema: UserSchema,
  },
  device: {
    name: DB_COLLECTION.DEVICE,
    schema: DeviceSchema,
  },
  token: {
    name: DB_COLLECTION.TOKEN,
    schema: TokenSchema,
  },
  notification: {
    name: DB_COLLECTION.NOTIFICATION,
    schema: NotificationSchema,
  },
  otp: {
    name: DB_COLLECTION.OTP,
    schema: OTPSchema,
  },
  profile: {
    name: DB_COLLECTION.PROFILE,
    schema: ProfileSchema,
  },
  location: {
    name: DB_COLLECTION.LOCATION,
    schema: LocationSchema,
  },
  permission: {
    name: DB_COLLECTION.PERMISSION,
    schema: PermissionSchema,
  },
  user_permission: {
    name: DB_COLLECTION.USER_PERMISSION,
    schema: UserPermissionSchema,
  },
  role_permission: {
    name: DB_COLLECTION.ROLE_PERMISSION,
    schema: RolePermissionSchema,
  },
  conversation: {
    name: DB_COLLECTION.CONVERSATION,
    schema: ConversationSchema,
  },
  message: {
    name: DB_COLLECTION.MESSAGE,
    schema: MessageSchema,
  },
});
