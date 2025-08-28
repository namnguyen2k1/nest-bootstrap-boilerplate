import { PermissionSchema } from "../../../modules/role/schemas/permission.schema";
import { DB_COLLECTION } from "./constant";
import {
  DeviceSchema,
  LocationSchema,
  NotificationSchema,
  OTPSchema,
  ProfileSchema,
  TokenSchema,
} from "./schemas";

export const MODEL_DEFINITIONS = Object.values({
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
});
