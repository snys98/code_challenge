import type { RedisClientOptions } from "@liaoliaots/nestjs-redis";
import type { JwtModuleOptions } from "@nestjs/jwt";

export const AppConfig = {
  mongoose: {
    mongoUri: process.env.MONGO_URI || "mongodb://mongo:27017/sapia",
  } as MongooseModuleConfig,
  logger: {
    appName: process.env.APP_NAME || "api",
    esNode: process.env.ES_NODE || 'http://elasticsearch:9200',
    apmUrl: process.env.APM_URL || 'http://apm-server:8200',
    esUsername: process.env.ES_USERNAME || 'elastic',
    esPassword: process.env.ES_PASSWORD || 'sapia123456',
  },
  redis: {
    host: process.env.REDIS_HOST || 'redis',
    port: process.env.REDIS_PORT || 6379,
  } as RedisModuleConfig,
  jwt: {
    secret: process.env.JWT_SECRET_KEY || "secretKey",
  } as JwtModuleOptions
} as AppConfig;
export declare type LoggerModuleConfig = {
  apmUrl?: string;
  appName: string;
  esNode?: string;
  esUsername?: string;
  esPassword?: string;
};

export declare type RedisModuleConfig = RedisClientOptions | RedisClientOptions[];
export declare type JwtModuleConfig = JwtModuleOptions;
export declare type MongooseModuleConfig = {
  mongoUri: string;
};
export declare type AppConfig = {
  mongoose: MongooseModuleConfig,
  logger: LoggerModuleConfig,
  redis: RedisModuleConfig,
  jwt?: JwtModuleConfig,
};
