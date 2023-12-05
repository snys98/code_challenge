import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import SwaggerOptions from './swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const swaggerDoc = SwaggerModule.createDocument(app, SwaggerOptions);
  // 将Swagger文档添加到应用程序中的特定路径  
  SwaggerModule.setup('swagger', app, swaggerDoc, {
    jsonDocumentUrl: "/swagger/json",
    yamlDocumentUrl: "/swagger/yaml",
  });
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
