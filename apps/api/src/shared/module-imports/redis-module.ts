import { RedisModule } from '@liaoliaots/nestjs-redis';
import { AppConfig } from '../../app.config';

export function createRedisModule({ redis }: AppConfig) {
    return RedisModule.forRoot({
        readyLog: true,
        commonOptions: {
            db: 0,
        },
        config: {
            ...redis
        }
    });
}
