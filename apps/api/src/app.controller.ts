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
import { AppConfig } from './app.config';

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
      async () => {
        let data = {};
        const result = (await this.http.responseCheck('apmServer', AppConfig.logger.apmUrl, (res) => {
          data = res.data;
          return validateStatus(res.status);
        }/* , { auth: { username: AppConfig.logger.esUsername, password: AppConfig.logger.esPassword } } */));
        result.apmServer = { ...data, status: result.apmServer.status };
        return result;
      },
      async () => {
        let data = {};
        const result = (await this.http.responseCheck('elasticsearch', AppConfig.logger.esNode, (res) => {
          data = res.data;
          return validateStatus(res.status);
        }, { auth: { username: AppConfig.logger.esUsername, password: AppConfig.logger.esPassword } }));
        result.elasticsearch = { ...data, status: result.elasticsearch.status };
        return result;
      },
      async () => {
        let data = {};
        const result = (await this.http.responseCheck('logstash', AppConfig.logger.logStashUrl, (res) => {
          data = res.data;
          return validateStatus(res.status);
        }/* , { auth: { username: AppConfig.logger.esUsername, password: AppConfig.logger.esPassword } } */));
        result.logstash = { ...data, status: result.logstash.status };
        return result;
      },
    ]);
  }


}
