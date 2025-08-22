import { ConfigType } from "@nestjs/config";
import { MongooseModuleFactoryOptions } from "@nestjs/mongoose";
import { Connection, ConnectionStates } from "mongoose";
import databaseConfig from "src/config/database.config";

export const createMongoDbConfig = (
  dbConfig: ConfigType<typeof databaseConfig>,
): MongooseModuleFactoryOptions => ({
  uri: dbConfig.mongo.uri,
  retryDelay: 1,
  retryAttempts: 1,
  connectionFactory: async (conn: Connection) => {
    // conn.plugin(); // config mongoose plugins
    if (conn.readyState === ConnectionStates.connected) {
      const { uri, dbName } = dbConfig.mongo;
      console.log(`[database] (mongodb) connected to "${dbName}" at ${uri}`);
    }
    return conn;
  },
});
