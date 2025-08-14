import { CACHE_MANAGER, CacheInterceptor } from '@nestjs/cache-manager';
import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Cache } from 'cache-manager';
import cacheConfig from 'src/config/cache.config';
import { NO_CACHE_KEY } from 'src/shared/decorators/no-cache.decorator';

@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {
  constructor(
    @Inject(CACHE_MANAGER) cacheManager: Cache,
    protected reflector: Reflector,
    @Inject(cacheConfig.KEY)
    private readonly config: ConfigType<typeof cacheConfig>,
  ) {
    super(cacheManager, reflector);
  }

  trackBy(context: ExecutionContext) {
    const isNoCache = this.reflector.getAllAndOverride<boolean>(NO_CACHE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isNoCache) {
      return undefined;
    }

    const request = context.switchToHttp().getRequest();

    if (request.method !== 'GET') return undefined;

    const prefix = this.config.prefix.replaceAll(' ', '_').toUpperCase();
    return `${prefix}::${request.method}::${request.originalUrl}`;
  }
}
