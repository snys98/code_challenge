import { Global, Module } from '@nestjs/common';
import { AppConfig } from '../app.config';
import { JwtService } from '@nestjs/jwt';
import { createSharedModules } from './module-imports';

const SharedModules = createSharedModules(AppConfig);
@Global()
@Module({
    imports: SharedModules,
    controllers: [],
    providers: [JwtService],
    exports: SharedModules
})
export class SharedModule { }
