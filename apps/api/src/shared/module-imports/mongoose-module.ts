import { MongooseModule } from '@nestjs/mongoose';
import { AppConfig } from '../../app.config';
import * as mongoose from 'mongoose';

export function createMongooseModule(config: AppConfig) {
  console.log(config.mongoose.mongoUri);
  mongoose.connect(config.mongoose.mongoUri, {
    replicaSet: "rs0",
    autoCreate: true,
    readPreference: "primary",
    appName: config.appName,
  })
  return MongooseModule.forRoot(config.mongoose.mongoUri, {
    replicaSet: "rs0",
    autoCreate: true,
    readPreference: "primary",
    appName: config.appName,
  });
}
