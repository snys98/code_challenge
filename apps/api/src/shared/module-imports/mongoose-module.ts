import { MongooseModule } from '@nestjs/mongoose';
import { AppConfig } from '../../app.config';

export function createMongooseModule({ mongoose }: AppConfig) {
    return MongooseModule.forRoot(mongoose.mongoUri, {
        replicaSet: "rs0",
        autoCreate: true,
        readPreference: "primaryPreferred",
    });
}
