import { CacheModule } from "@nestjs/cache-manager";
import { Inject, Module } from "@nestjs/common";
import { ConfigModule, ConfigType } from "@nestjs/config";
import { redisStore } from "cache-manager-redis-store";
import Redis from "ioredis";
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
          return {
            store: redisStore,
            url: config.redis.url,
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
export class CachingModule {
  private client: Redis;

  constructor(
    @Inject(cacheConfig.KEY)
    private readonly config: ConfigType<typeof cacheConfig>,
  ) {
    const { store, redis } = this.config;
    const { port, host, password } = redis;
    this.client =
      store === "redis"
        ? new Redis(port, host, {
            password,
          })
        : new Redis(port);

    this.client.on("connect", () => {
      console.log(
        `\n[redis-${store === "redis" ? "cloud" : "local"}] database connected at ${host}`,
      );
    });
  }
}
