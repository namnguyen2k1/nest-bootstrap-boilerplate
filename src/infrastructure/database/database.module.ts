import { Module } from "@nestjs/common";
import { MongodbModule } from "./mongodb/mongodb.module";
import { PostgreSQLModule } from "./postgresql/postgresql.module";

@Module({
  imports: [
    MongodbModule,
    PostgreSQLModule,
    // more database ...
  ],
})
export class DatabaseModule {}
