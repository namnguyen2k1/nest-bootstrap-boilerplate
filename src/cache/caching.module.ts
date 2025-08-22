import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigType } from "@nestjs/config";
import { redisStore } from "cache-manager-redis-store";
import cacheConfig from "src/config/cache.config";
import { CachingService } from "./caching.service";

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [cacheConfig.KEY],
      isGlobal: true,
      useFactory: async (config: ConfigType<typeof cacheConfig>) => {
        if (config.store === "redis") {
          const store = await redisStore({ url: config.redis.url });
          return {
            store: store as any,
            ttl: config.ttl,
          };
        }
        return {
          ttl: config.ttl,
          max: config.max,
        };
      },
    }),
  ],
  providers: [CachingService],
  exports: [CachingService],
})
export class CachingModule {}
