import { Global, Module, OnModuleInit } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { DeviceRepository } from "@repositories/device.repository";
import { LocationRepository } from "@repositories/location.repository";
import { NotificationRepository } from "@repositories/notification.repository";
import { OTPRepository } from "@repositories/otp.repository";
import { ProfileRepository } from "@repositories/profile.repository";
import { TokenRepository } from "@repositories/token.repository";
import { PermissionRepository } from "@role/repositories/permission.repository";
import mongoose from "mongoose";
import databaseConfig from "src/config/database.config";
import { createMongoDbConfig } from "./config-database";
import { DB_CONNECTION } from "./constant";
import { MODEL_DEFINITIONS } from "./model-definitions";

const PROVIDERS = [
  DeviceRepository,
  TokenRepository,
  NotificationRepository,
  PermissionRepository,
  LocationRepository,
  ProfileRepository,
  OTPRepository,
];

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [databaseConfig.KEY],
      useFactory: createMongoDbConfig,
      connectionName: DB_CONNECTION.PLAYGROUND,
    }),
    MongooseModule.forFeature(MODEL_DEFINITIONS, DB_CONNECTION.PLAYGROUND),
  ],
  providers: [...PROVIDERS],
  exports: [...PROVIDERS],
})
export class MongodbModule implements OnModuleInit {
  onModuleInit() {
    mongoose.set("runValidators", true);
    mongoose.set("strictQuery", true);
    mongoose.set("debug", true);
  }
}
