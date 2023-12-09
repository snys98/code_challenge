import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { HealthCheckService, HttpHealthIndicator, MongooseHealthIndicator } from '@nestjs/terminus';

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
      }
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "ok"', () => {
      expect(appController.check()).toBe('ok');
    });
  });
});
