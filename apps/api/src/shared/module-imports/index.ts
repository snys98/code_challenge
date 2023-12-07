import { createLoggerModule } from './logger-module';
import { RedisHealthModule } from "@liaoliaots/nestjs-redis-health";
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AppConfig } from '../../app.config';
import { createMongooseModule } from './mongoose-module';
import { createRedisModule } from './redis-module';

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
            },
        }),
    ];
}
