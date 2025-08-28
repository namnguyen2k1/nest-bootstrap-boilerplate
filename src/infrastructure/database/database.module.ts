import { Module } from "@nestjs/common";
import { MongodbModule } from "./mongodb/mongodb.module";

@Module({
  imports: [
    MongodbModule,
    // PostgreSQLModule,
    // more database ...
  ],
})
export class DatabaseModule {}
