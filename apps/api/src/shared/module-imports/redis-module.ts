import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { AppConfig } from '../../app.config';
export function createCacheModule(appConfig: AppConfig) {

  return CacheModule.register({
    isGlobal: true,
    store() {
      return redisStore(appConfig.redis);
    },
  });
}
