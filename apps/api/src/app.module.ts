import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { createSharedModules } from './shared/module-configs/shared-modules';

const sharedModulesConfig: SharedModulesConfig = {
  mongoose: {
    mongoUri: process.env.MONGO_URI || "mongodb://mongo:27017/sapia",
  },
  logger: {
    appName: process.env.APP_NAME || "api",
    esNode: process.env.ES_NODE || 'http://elasticsearch:9200',
    esUsername: process.env.ES_USERNAME || 'elastic',
    esPassword: process.env.ES_PASSWORD || 'sapia123456',
  },
  redis: {
    host: 'redis',
    port: 6379,
  }
};

@Module({
  imports: [
    ...createSharedModules(sharedModulesConfig),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [Logger],
})
export class AppModule { }
