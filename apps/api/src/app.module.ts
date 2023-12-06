import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { createRootModules } from './shared/module-imports';
import { AppConfig } from './app.config';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    ...createRootModules(AppConfig),
    SharedModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule { }
