import { MongooseModule } from '@nestjs/mongoose';
import { createLoggerModule } from './create-logger-module';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { RedisHealthModule } from "@liaoliaots/nestjs-redis-health";
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';

function createMongooseModule(config: MongooseModuleConfig) {
    return MongooseModule.forRoot(config.mongoUri, {
        replicaSet: "rs0",
        autoCreate: true,
        readPreference: "primaryPreferred",
    });
}

function createRedisModule(config: RedisModuleConfig) {
    return RedisModule.forRoot({
        config,
        readyLog: true,
        commonOptions: {
            db: 0,
        }
    });
}

export function createSharedModules(envConfig: SharedModulesConfig) {
    return [
        HttpModule,
        TerminusModule,
        createLoggerModule(envConfig.logger),
        createRedisModule(envConfig.redis),
        RedisHealthModule,
        createMongooseModule(envConfig.mongoose),
    ];
}
