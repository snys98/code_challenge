import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { RedisHealthIndicator } from '@liaoliaots/nestjs-redis-health';
import { Controller, Get, Post } from '@nestjs/common';
import { HealthCheckService, HttpHealthIndicator, HealthCheck, MongooseHealthIndicator, HealthIndicator } from '@nestjs/terminus';
import Redis from 'ioredis';

const validateStatus = (status) => {
  return status >= 200 && status < 503;
};

@Controller()
export class AppController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    @InjectRedis() private readonly redis: Redis,
    private redisIndicator: RedisHealthIndicator,
    private mongoose: MongooseHealthIndicator,
  ) { }

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.mongoose.pingCheck('mongo'),
      () => this.redisIndicator.checkHealth('redis', {
        client: this.redis,
        type: 'redis',
      }),
      () => this.http.pingCheck('elasticsearch', 'http://elasticsearch:9200', { validateStatus }),
    ]);
  }


}
