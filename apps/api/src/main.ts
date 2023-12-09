import './shared/extensions';

import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import SwaggerOptions from './swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const swaggerDoc = SwaggerModule.createDocument(app, SwaggerOptions);
  // 将Swagger文档添加到应用程序中的特定路径  
  SwaggerModule.setup('swagger', app, swaggerDoc, {
    jsonDocumentUrl: "/swagger/json",
    yamlDocumentUrl: "/swagger/yaml",
  });
  app.enableCors();
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  await app.listen(3000);
}
bootstrap();
