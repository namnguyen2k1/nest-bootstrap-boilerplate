import { PermissionSchema } from "../../../modules/role/schemas/permission.schema";
import { DB_COLLECTION } from "./constant";
import {
  ConversationSchema,
  DeviceSchema,
  LocationSchema,
  MessageSchema,
  NotificationSchema,
  OTPSchema,
  ProfileSchema,
  TokenSchema,
  UserPermissionSchema,
  UserSchema,
} from "./schemas";

export const MODEL_DEFINITIONS = Object.values({
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
  conversation: {
    name: DB_COLLECTION.CONVERSATION,
    schema: ConversationSchema,
  },
  message: {
    name: DB_COLLECTION.MESSAGE,
    schema: MessageSchema,
  },
});
