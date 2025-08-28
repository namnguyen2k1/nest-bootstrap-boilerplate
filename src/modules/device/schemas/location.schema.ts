import { Location } from "@device/models/location.model";
import { SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { MongodbUtils } from "../../../infrastructure/database/mongodb/mongodb.utils";

export type LocationDocument = HydratedDocument<Location>;

export const LocationSchema = SchemaFactory.createForClass(Location);

LocationSchema.loadClass(Location);

MongodbUtils.customSchemaHooks({ schema: LocationSchema });
