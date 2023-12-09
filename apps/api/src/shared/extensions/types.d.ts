import type * as CacheManager from 'cache-manager';

import type { InjectionToken } from '@nestjs/common';

declare module 'cache-manager' {
    export let Cache: InjectionToken<CacheManager.Cache>;
}
