import pinoElastic from "pino-elasticsearch";
import pinoMultiStream from "pino-multi-stream";
import express from 'express';
import ObjectId from 'bson-objectid';
import { pino } from 'pino';
import ecsFormat from '@elastic/ecs-pino-format';
import { LoggerModule } from 'nestjs-pino';

export function createLoggerModule(envConfig) {
    const streamToElastic = pinoElastic({
        index(logTime: string) {
            return `api-${logTime.substr(0, 10)}`;
        },
        node: envConfig.esNode,
        auth: {
            username: envConfig.esUsername,
            password: envConfig.esPassword,
        },
        esVersion: envConfig.esVersion,
        flushBytes: envConfig.flushBytes,
    });

    streamToElastic.on('error', (error) => {
        console.error('Elasticsearch client error:', error);
    })

    streamToElastic.on('insertError', (error) => {
        console.error('Elasticsearch server error:', error);
    })

    const pinoLogger = pino(ecsFormat({
        apmIntegration: true,
        convertReqRes: true,
    }), pinoMultiStream.multistream([
        { stream: process.stdout },
        { stream: streamToElastic },
    ]))

    const excludeLoggingPaths = ["/health", "/auth"];
    const LoggerModuleConfig = {
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
            logger: pinoLogger,
            genReqId: (req, res) => new ObjectId(new Date().getTime()).toHexString(),
        },
    };

    return LoggerModule.forRoot(LoggerModuleConfig);
}
