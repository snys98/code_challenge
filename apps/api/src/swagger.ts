import { DocumentBuilder } from "@nestjs/swagger";

const SwaggerOptions = new DocumentBuilder()
    .setTitle('challenge API')
    .setDescription('challenge API Description')
    .setVersion('1.0')
    .build();

export default SwaggerOptions;
