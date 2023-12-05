import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forRoot("mongodb://mongo:27017/sapia", {
    replicaSet: "rs0",
    autoCreate: true,
    readPreference: "primaryPreferred",
  }), UserModule, AuthModule],
  controllers: [AppController],
  providers: [Logger],
})
export class AppModule { }
