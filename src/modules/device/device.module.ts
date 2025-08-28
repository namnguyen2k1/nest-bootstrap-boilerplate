import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { DB_COLLECTION, DB_CONNECTION } from "src/infrastructure/database/mongodb/constant";
import { DeviceController } from "./device.controller";
import { DeviceService } from "./device.service";
import { DeviceRepository } from "./repositories/device.repository";
import { LocationRepository } from "./repositories/location.repository";
import { DeviceSchema } from "./schemas/device.schema";
import { LocationSchema } from "./schemas/location.schema";

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: DB_COLLECTION.DEVICE,
          schema: DeviceSchema,
        },
        {
          name: DB_COLLECTION.LOCATION,
          schema: LocationSchema,
        },
      ],
      DB_CONNECTION.PLAYGROUND,
    ),
  ],
  controllers: [DeviceController],
  providers: [DeviceRepository, LocationRepository, DeviceService],
  exports: [DeviceService],
})
export class DeviceModule {}
