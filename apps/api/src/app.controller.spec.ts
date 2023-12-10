import "../src/shared/extensions";

import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { HealthCheckService, HttpHealthIndicator, MongooseHealthIndicator } from '@nestjs/terminus';
import { RedisHealthIndicator } from '@songkeys/nestjs-redis-health';
import { Cache } from 'cache-manager';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [{
        provide: HealthCheckService,
        useValue: {
          check: () => 'ok',
        }
      }, {
        provide: MongooseHealthIndicator,
        useValue: {
          pingCheck: () => 'ok',
        }
      }, {
        provide: HttpHealthIndicator,
        useValue: {
          pingCheck: () => 'ok',
        }
      },
        {
          provide: Cache,
          useValue: {
            store: {
              client: 'ok',
            },
          }
        },
      {
        provide: RedisHealthIndicator,
        useValue: {
          checkHealth: () => 'ok',
        }
      }
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "ok"', async () => {
      expect(appController.check()).toBe('ok');
    });
  });
});
