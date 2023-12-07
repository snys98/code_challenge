import { MongooseModule } from '@nestjs/mongoose';
import { createLoggerModule } from './create-logger-module';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { RedisHealthModule } from "@liaoliaots/nestjs-redis-health";
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AppConfig } from '../../app.config';

function createMongooseModule({ mongoose }: AppConfig) {
    return MongooseModule.forRoot(mongoose.mongoUri, {
        replicaSet: "rs0",
        autoCreate: true,
        readPreference: "primaryPreferred",
    });
}

function createRedisModule({ redis }: AppConfig) {
    return RedisModule.forRoot({
        readyLog: true,
        commonOptions: {
            db: 0,
        },
        config: {
            ...redis
        }
    });
}

export function createRootModules(config: AppConfig) {
    return [
        HttpModule,
        TerminusModule,
        createLoggerModule(config),
        createRedisModule(config),
        RedisHealthModule,
        createMongooseModule(config),
    ];
}

export function createSharedModules(config: AppConfig) {
    return [
        PassportModule.register({ defaultStrategy: 'local' }),
        JwtModule.register({
            secret: config.jwt?.secret ?? "secretKey", // replace with your own secret key  
            signOptions: { expiresIn: '60m', ...config.jwt?.signOptions },
            verifyOptions: {
                ignoreExpiration: true,
            }
        }),
    ];
}
