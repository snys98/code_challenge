import pinoElastic from "pino-elasticsearch";
import pinoMultiStream from "pino-multi-stream";
import express from 'express';
import ObjectId from 'bson-objectid';
import { pino } from 'pino';
import ecsFormat from '@elastic/ecs-pino-format';
import { LoggerModule, Params } from 'nestjs-pino';
import { AppConfig } from "../../app.config";

export function createLoggerModule({ logger }: AppConfig) {
    const streamToElastic = pinoElastic({
        index(logTime: string) {
            return `${logger.appName}-${logTime.substr(0, 10)}`;
        },
        node: logger.esNode,
        auth: {
            username: logger.esUsername,
            password: logger.esPassword,
        },
        esVersion: 8,
        flushBytes: 1000,
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

    const LoggerModuleConfig = {
        exclude: ["auth"],
        pinoHttp: {
            quietReqLogger: true,
            level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
            autoLogging: true,
            redact: process.env.NODE_ENV !== 'production' ? [] : {
                paths: ['req.headers.authorization', 'req.headers.cookie'],
                censor: '**********',
            },
            customLogLevel(req, res, error) {
                if (error || res.statusCode >= 500) {
                    return 'error';
                }
                if (res.statusCode >= 400) {
                    return 'warn';
                }
                return 'info';
            },
            logger: pinoLogger,
            genReqId: (req, res) => new ObjectId(new Date().getTime()).toHexString(),
        },
    } as Params;

    return LoggerModule.forRoot(LoggerModuleConfig);
}
