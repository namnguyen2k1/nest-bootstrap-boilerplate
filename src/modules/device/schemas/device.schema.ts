import { Device } from "@device/models/device.model";
import { SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { DB_COLLECTION } from "../../../infrastructure/database/mongodb/constant";
import { MongodbUtils } from "../../../infrastructure/database/mongodb/mongodb.utils";

export type DeviceDocument = HydratedDocument<Device>;

export const DeviceSchema = SchemaFactory.createForClass(Device);

DeviceSchema.loadClass(Device);

DeviceSchema.virtual("location", {
  ref: DB_COLLECTION.LOCATION,
  localField: "_id",
  foreignField: "deviceId",
});
DeviceSchema.virtual("token", {
  ref: DB_COLLECTION.TOKEN,
  localField: "_id",
  foreignField: "deviceId",
});

MongodbUtils.customSchemaHooks({ schema: DeviceSchema });
