import { Global, Module } from '@nestjs/common';
import { AppConfig } from '../app.config';
import { Logger } from 'nestjs-pino';
import { JwtService } from '@nestjs/jwt';
import { createSharedModules } from './module-configs/init-modules';

const SharedModules = createSharedModules(AppConfig);
@Global()
@Module({
    imports: SharedModules,
    controllers: [],
    providers: [Logger, JwtService],
    exports: SharedModules
})
export class SharedModule { }
