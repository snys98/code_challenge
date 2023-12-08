import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TerminusModule } from '@nestjs/terminus';
import { RedisHealthModule } from '@songkeys/nestjs-redis-health';

import { AppConfig } from '../../app.config';
import { createLoggerModule } from './logger-module';
import { createMongooseModule } from './mongoose-module';
import { createCacheModule } from './redis-module';

export function createRootModules(config: AppConfig) {
    return [
        HttpModule,
        TerminusModule,
        createLoggerModule(config),
        createCacheModule(config),
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
