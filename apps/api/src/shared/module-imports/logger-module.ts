import ecsFormat from '@elastic/ecs-winston-format';
import { AppConfig } from "../../app.config";
import winston, { transport } from "winston";
import { ElasticsearchTransport } from "winston-elasticsearch";
import apm from "elastic-apm-node"
import { WinstonModule, utilities as nestWinstonModuleUtilities } from 'nest-winston';

export function createLoggerModule({ logger }: AppConfig) {

    const transports: transport[] = [
        new winston.transports.Console({
            level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.ms(),
                nestWinstonModuleUtilities.format.nestLike(logger.appName, {
                    colors: true,
                    prettyPrint: true,
                })
            )
        }),
    ];
    if (logger.esNode) {
        const esTransport = new ElasticsearchTransport({
            indexPrefix: logger.appName,
            apm: logger.apmUrl ? apm.start({
                serverUrl: logger.apmUrl,
                logLevel: "info",
                serviceName: logger.appName,
                useElasticTraceparentHeader: true,
            }) : undefined,
            format: ecsFormat({
                convertReqRes: true,
                convertErr: true,
                apmIntegration: !!logger.apmUrl,
            }),
            useTransformer: false,
            level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
            clientOpts: {
                name: logger.appName,
                node: 'http://elasticsearch:9200',
                auth: {
                    username: logger.esUsername,
                    password: logger.esPassword,
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
