import { Module, OnModuleInit } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import mongoose from "mongoose";
import databaseConfig from "src/config/database.config";
import { createMongoDbConfig } from "./config-database";
import { DB_CONNECTION } from "./constant";

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [databaseConfig.KEY],
      useFactory: createMongoDbConfig,
      connectionName: DB_CONNECTION.PLAYGROUND,
    }),
  ],
})
export class MongodbModule implements OnModuleInit {
  onModuleInit() {
    mongoose.set("runValidators", true);
    mongoose.set("strictQuery", true);
    mongoose.set("debug", true);
  }
}
