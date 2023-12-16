import ObjectID from 'bson-objectid';
import apm from 'elastic-apm-node';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import winston, { transport } from 'winston';
import { ElasticsearchTransport } from 'winston-elasticsearch';

import { ecsFormat } from '@elastic/ecs-winston-format';

import { AppConfig } from '../../app.config';

export function createLoggerModule(appConfig: AppConfig) {

    const transports: transport[] = [
        new winston.transports.Console({
            level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.ms(),
                nestWinstonModuleUtilities.format.nestLike(appConfig.appName, {
                    colors: true,
                    prettyPrint: true,
                })
            )
        }),
    ];
    if (appConfig.logger.esNode) {
        const format = ecsFormat({
            convertReqRes: true,
            convertErr: true,
            apmIntegration: !!appConfig.logger.apmUrl,
        });
        const esTransport = new ElasticsearchTransport({
            indexPrefix: appConfig.appName,
            apm: appConfig.logger.apmUrl ? apm.start({
                serverUrl: appConfig.logger.apmUrl,
                logLevel: "info",
                serviceName: appConfig.appName,
                useElasticTraceparentHeader: true,
            }) : undefined,
            format: format,
            useTransformer: false,
            level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
            clientOpts: {
                enableMetaHeader: true,
                maxResponseSize: 10000000,
                generateRequestId: () => { new ObjectID(Date.now()).toHexString()},
                name: appConfig.appName,
              node: appConfig.logger.esNode,
                auth: {
                    username: appConfig.logger.esUsername,
                    password: appConfig.logger.esPassword,
                },
            }
        });
        transports.push(esTransport);
    }


    const module = WinstonModule.forRoot({
        transports
    });
    return module;
}
