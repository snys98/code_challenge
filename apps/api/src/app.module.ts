/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { HealthModule } from './modules/health/health.module';
import { LoggerModule } from 'nestjs-pino';
import * as eshelper from '@elastic/ecs-helpers';
@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
        // install 'pino-pretty' package in order to use the following option
        transport: process.env.NODE_ENV !== 'production' ? { target: 'pino-pretty' } : undefined,
        customAttributeKeys: {
          req: 'http.request',
          res: 'http.response',
          responseTime: 'event.duration',
        },
        messageKey: 'message',
        timestamp: () => `,"@timestamp":"${new Date().toISOString()}"`,
        serializers: {
          'http.response': (object: any) => {
            const { statusCode, ...response } = object;
            return {
              ...response,
              status_code: statusCode,
            };
          },
          'http.request': () => {
            // here you can perform headers transformation
          },
        },
        formatters: {
          bindings(bindings: Record<string, unknown>) {
            const {
              // `pid` and `hostname` are default bindings, unless overriden by
              // a `base: {...}` passed to logger creation.
              pid,
              hostname,
              // name is defined if `log = pino({name: 'my name', ...})`
              name,
              // Warning: silently drop any "ecs" value from `base`. See
              // "ecs.version" comment below.
              ecs,
              ...ecsBindings
            } = bindings;
            if (pid !== undefined) {
              // https://www.elastic.co/guide/en/ecs/current/ecs-process.html#field-process-pid
              ecsBindings.process = { pid: pid };
            }
            if (hostname !== undefined) {
              // https://www.elastic.co/guide/en/ecs/current/ecs-host.html#field-host-hostname
              ecsBindings.host = { hostname: hostname };
            }
            if (name !== undefined) {
              // https://www.elastic.co/guide/en/ecs/current/ecs-log.html#field-log-logger
              ecsBindings.log = { logger: name };
            }
            return ecsBindings;
          },
          level: (label: string) => ({ 'log.level': label }),
          log: (o: object) => {
            //@ts-ignore
            const { error, ...ecsObject } = o;
            eshelper.formatError(ecsObject, error);
            return ecsObject;
          },
        },
      },
    }),
    MongooseModule.forRoot("mongodb://mongo:27017/sapia", {
      replicaSet: "rs0",
      autoCreate: true,
      readPreference: "primaryPreferred",
    }), UserModule, AuthModule, HealthModule],
  controllers: [AppController],
  providers: [Logger],
})
export class AppModule { }
