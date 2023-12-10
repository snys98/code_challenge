import type { RedisClientOptions } from 'redis';

import type { JwtModuleOptions } from '@nestjs/jwt';
export const AppConfig = {
  appName: process.env.APP_NAME || "api",
  mongoose: {
    mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/challenge",
  } as MongooseModuleConfig,
  logger: {
    esNode: process.env.ES_NODE || 'http://elasticsearch:9200',
    apmUrl: process.env.APM_URL || 'http://apm-server:8200',
    esUsername: process.env.ES_USERNAME || 'elastic',
    esPassword: process.env.ES_PASSWORD || 'challenge123456',
  },
  redis: {
    url: process.env.REDIS_URL || "redis://redis:6379/0",
  } as RedisClientOptions,
  jwt: {
    secret: process.env.JWT_SECRET_KEY || "secretKey",
  } as JwtModuleOptions
} as AppConfig;
export declare type LoggerModuleConfig = {
  apmUrl?: string;
  esNode?: string;
  esUsername?: string;
  esPassword?: string;
};

export declare type JwtModuleConfig = JwtModuleOptions;
export declare type MongooseModuleConfig = {
  mongoUri: string;
};
export declare type AppConfig = {
  appName: string,
  mongoose: MongooseModuleConfig,
  logger: LoggerModuleConfig,
  redis: RedisClientOptions,
  jwt?: JwtModuleConfig,
};
