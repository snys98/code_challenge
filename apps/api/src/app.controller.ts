import {
  Controller,
  Get,
  Inject,
} from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MongooseHealthIndicator,
} from '@nestjs/terminus';
import { Cache } from 'cache-manager';
import { RedisHealthIndicator } from '@songkeys/nestjs-redis-health';

const validateStatus = (status) => {
  return status >= 200 && status < 503;
};

@Controller()
export class AppController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    @Inject(Cache) private readonly cache: Cache,
    private redisIndicator: RedisHealthIndicator,
    private mongoose: MongooseHealthIndicator,
  ) {
  }

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.mongoose.pingCheck('mongo', { timeout: 1000 }),
      () => this.redisIndicator.checkHealth('redis', {
        timeout: 1000,
        client: this.cache.store["client"],
        type: 'redis',
      }),
      // () => this.http.pingCheck('apm', 'http://apm-server.dev.challenge', {
      //   validateStatus,
      //   timeout: 1000,
      // }),
      // () => this.http.pingCheck('elasticsearch', 'http://localhost:9200', {
      //   validateStatus,
      //   timeout: 1000,
      // }),
      // () => this.http.pingCheck('logstash', 'http://logstash.dev.challenge', {
      //   validateStatus,
      //   timeout: 1000,
      // }),
      // () => this.http.pingCheck('kibana', 'http://kibana.dev.challenge', {
      //   validateStatus,
      //   timeout: 1000,
      // })
    ]);
  }


}
