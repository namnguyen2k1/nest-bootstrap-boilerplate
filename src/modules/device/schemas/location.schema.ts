import { LocationModel } from "@device/models/location.model";
import { SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { MongodbUtils } from "../../../infrastructure/database/mongodb/mongodb.utils";

export type LocationDocument = HydratedDocument<LocationModel>;

export const LocationSchema = SchemaFactory.createForClass(LocationModel);

LocationSchema.loadClass(LocationModel);

MongodbUtils.customSchemaHooks({ schema: LocationSchema });
