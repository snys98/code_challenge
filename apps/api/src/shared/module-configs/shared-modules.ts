import { MongooseModule } from '@nestjs/mongoose';
import { createLoggerModule } from './create-logger-module';

function createMongooseModule(mongoUri) {
    return MongooseModule.forRoot(mongoUri, {
        replicaSet: "rs0",
        autoCreate: true,
        readPreference: "primaryPreferred",
    });
}

export function createSharedModules(envConfig) {
    return [
        createLoggerModule(envConfig),
        createMongooseModule(envConfig.mongoUri),
    ];
}
