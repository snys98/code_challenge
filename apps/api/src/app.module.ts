/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { HealthModule } from './modules/health/health.module';
import { LoggerModule } from 'nestjs-pino';
import * as eshelper from '@elastic/ecs-helpers';
import pinoElastic from "pino-elasticsearch";
import pinoMultiStream from "pino-multi-stream";
import express from 'express';
import ObjectId from 'bson-objectid';

const streamToElastic = pinoElastic({
  index(logTime: string) {
    return `api-${logTime.substr(0, 10)}`;
  },
  node: 'http://elasticsearch:9200',
  auth: {
    username: 'elastic',
    password: 'sapia123456'
  },
  esVersion: 8,
  flushBytes: 1000,
});
// Capture errors like unable to connect Elasticsearch instance.
streamToElastic.on('error', (error) => {
  console.error('Elasticsearch client error:', error);
})
// Capture errors returned from Elasticsearch, "it will be called every time a document can't be indexed".
streamToElastic.on('insertError', (error) => {
  console.error('Elasticsearch server error:', error);
})

const excludeLoggingPaths = ["/health", "/auth"];
@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        autoLogging: {
          ignore: (req: express.Request) => {
            for (const path of excludeLoggingPaths) {
              if (req.path.startsWith(path)) {
                return false;
              }
            }
            return true;
          },
        },
        redact: process.env.NODE_ENV !== 'production' ? [] : {
          paths: ['req.headers.authorization'],
          censor: '**********',
        },
        stream: pinoMultiStream.multistream([
          { stream: process.stdout },
          { stream: streamToElastic },
        ]),
        genReqId: (req, res) => new ObjectId(new Date().getTime()).toHexString(),
        customAttributeKeys: {
          req: 'http.req',
          res: 'http.res',
          responseTime: 'http.duration', 
        },
        messageKey: 'message',
        timestamp: () => `,"@timestamp":"${new Date().toISOString()}"`,
        serializers: {
          'http.res': (response: express.Response) => {
            return {
              ...response,
            };
          },
          'http.req': (request: express.Request) => {
            return {
              ...request,
              params: undefined,
            };
          },
        },
        formatters: {
          level: (label: string) => ({ 'level': label }),
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
