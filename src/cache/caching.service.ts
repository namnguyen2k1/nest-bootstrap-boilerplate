import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { Cache } from "cache-manager";
import cacheConfig from "src/config/cache.config";

@Injectable()
export class CachingService {
  constructor(
    @Inject(CACHE_MANAGER) private cache: Cache,
    @Inject(cacheConfig.KEY) private config: ConfigType<typeof cacheConfig>,
  ) {}

  readonly keyFactory = {
    userById: (id: string) => this.getKey(`user:id:${id}`),
    roleByName: (name: string) => this.getKey(`role:name:${name}`),
    roleById: (name: string) => this.getKey(`role:id:${name}`),
  };

  private getKey(key: string): string {
    const prefix: string = this.config.prefix.replaceAll(" ", "_").toUpperCase();
    return `${prefix}:${key}`;
  }

  async get<T>(key: string): Promise<T | undefined> {
    return await this.cache.get<T>(this.getKey(key));
  }

  async set<T>(key: string, value: T, ms?: number): Promise<void> {
    if (!ms) {
      ms = this.config.ttl;
    }
    await this.cache.set(this.getKey(key), value, ms);
  }

  async delete(key: string): Promise<void> {
    await this.cache.del(this.getKey(key));
  }

  async reset(): Promise<void> {
    await this.cache.clear();
  }
}
