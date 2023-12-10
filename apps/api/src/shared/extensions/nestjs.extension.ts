import * as CacheManager from 'cache-manager';

import * as NestCacheManager from '@nestjs/cache-manager';

// here to avoid duplicate import of cache-manager
console.log("patching cache manager");
Object.assign(CacheManager, { Cache: NestCacheManager.CACHE_MANAGER });
