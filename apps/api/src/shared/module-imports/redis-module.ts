import type { RedisClientOptions } from 'redis';

import { CacheModule } from '@nestjs/cache-manager';

import { AppConfig } from '../../app.config';

export function createCacheModule(appConfig: AppConfig) {
    return CacheModule.register<RedisClientOptions>({
        url: appConfig.redis.url,
        clientInfoTag: appConfig.appName,
        isGlobal: true,
    });
}
