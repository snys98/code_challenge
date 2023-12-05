import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { HealthModule } from './modules/health/health.module';
import { createSharedModules } from './shared/module-configs/shared-modules';

const envConfig = {
  mongoUri: process.env.MONGO_URI || "mongodb://mongo:27017/sapia",
  esNode: process.env.ES_NODE || 'http://elasticsearch:9200',
  esUsername: process.env.ES_USERNAME || 'elastic',
  esPassword: process.env.ES_PASSWORD || 'sapia123456',
};

@Module({
  imports: [
    ...createSharedModules(envConfig),
    UserModule,
    AuthModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [Logger],
})
export class AppModule { }
