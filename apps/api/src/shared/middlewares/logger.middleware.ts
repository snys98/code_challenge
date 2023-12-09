import { NextFunction, Request, Response } from 'express';
import { Inject, Injectable, Logger, NestMiddleware } from '@nestjs/common';
import * as http from 'http';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    private readonly logger = new Logger(LoggerMiddleware.name);
    constructor() {
    }

    public use(request: Request, response: Response, next: NextFunction): void {
        // const { body, method, originalUrl, headers } = request;
        // todo: log request on demand and censor sensitive data
        // this.logger.log({ body, method, originalUrl, headers })
        next();
    }
}
