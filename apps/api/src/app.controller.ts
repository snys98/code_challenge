// import Redis from 'ioredis';

import {
  Controller,
  Get,
} from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MongooseHealthIndicator,
} from '@nestjs/terminus';

// import { InjectRedis } from '@songkeys/nestjs-redis';
// import { RedisHealthIndicator } from '@songkeys/nestjs-redis-health';

const validateStatus = (status) => {
  return status >= 200 && status < 503;
};

@Controller()
export class AppController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    // @InjectRedis() private readonly redis: Redis,
    // private redisIndicator: RedisHealthIndicator,
    private mongoose: MongooseHealthIndicator,
  ) { }

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.mongoose.pingCheck('mongo', { timeout: 1000 }),
      // () => this.redisIndicator.checkHealth('redis', {
      //   timeout: 1000,
      //   client: this.redis,
      //   type: 'redis',
      // }),
      () => this.http.pingCheck('apm', 'http://apm-server.dev.challenge', {
        validateStatus,
        timeout: 1000,
      }),
      () => this.http.pingCheck('elasticsearch', 'http://elasticsearch.dev.challenge', {
        validateStatus,
        timeout: 1000,
      }),
    ]);
  }


}
