import { Logger, MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { createRootModules } from './shared/module-imports';
import { AppConfig } from './app.config';
import { SharedModule } from './shared/shared.module';
import { LoggerMiddleware } from './shared/middlewares/logger.middleware';

@Module({
  imports: [
    ...createRootModules(AppConfig),
    SharedModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');
  }
}
