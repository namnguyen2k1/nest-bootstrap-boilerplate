import { MongooseDefaultQueryMiddleware } from "mongoose";

export const DB_CONNECTION = {
  PLAYGROUND: "nestjs-playground-db",
};

export const DB_COLLECTION = {
  USER: "users",
  ROLE: "roles",
  PERMISSION: "permissions",
  ROLE_PERMISSION: "role-permissions",
  USER_PERMISSION: "user-permissions",
  DEVICE: "devices",
  LOCATION: "locations",
  TOKEN: "tokens",
  OTP: "otp",
  PROFILE: "profiles",
  NOTIFICATION: "notifications",
  CONVERSATION: "conversations",
  MESSAGE: "messages",
};

export enum READ_PREFERENCE_MODE {
  PRIMARY = "primary",
  PRIMARY_PREFERRED = "primaryPreferred",
  SECONDARY = "secondary",
  SECONDARY_PREFERRED = "secondaryPreferred",
  NEAREST = "nearest",
}

export const DEFAULT_READ_PREFERENCE_MODE = READ_PREFERENCE_MODE.PRIMARY_PREFERRED;

export const DEFAULT_QUERY_MIDDLEWARES: MongooseDefaultQueryMiddleware[] = [
  "estimatedDocumentCount",
  "countDocuments",
  "deleteMany",
  "distinct",
  "find",
  "findOne",
  "findOneAndDelete",
  "findOneAndReplace",
  "findOneAndUpdate",
  "replaceOne",
  "updateMany",
  "updateOne",
  "deleteOne",
];
