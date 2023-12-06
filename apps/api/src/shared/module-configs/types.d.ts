declare type LoggerModuleConfig = {
    appName: any;
    esNode: string;
    esUsername: string;
    esPassword: string;
};

declare type RedisModuleConfig = RedisClientOptions | RedisClientOptions[]
;

declare type MongooseModuleConfig = {
    mongoUri: string;
};

declare type SharedModulesConfig = {
    mongoose: MongooseModuleConfig,
    logger?: LoggerModuleConfig,
    redis: RedisModuleConfig
};
