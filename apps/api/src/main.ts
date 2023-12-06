import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import SwaggerOptions from './swagger';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';

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
  app.useGlobalInterceptors(new LoggerErrorInterceptor());
  app.useLogger(app.get(Logger));
  await app.listen(3000);
}
bootstrap();
