import { MongooseModule } from '@nestjs/mongoose';
import { AppConfig } from '../../app.config';

export function createMongooseModule(config: AppConfig) {
  console.log(config.mongoose.mongoUri);

  return MongooseModule.forRoot(config.mongoose.mongoUri, {
    replicaSet: "rs0",
    autoCreate: true,
    readPreference: "primary",
    appName: config.appName,
  });
}
