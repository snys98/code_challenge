import { DocumentBuilder } from "@nestjs/swagger";

const SwaggerOptions = new DocumentBuilder()
    .setTitle('sapia API')
    .setDescription('sapia API Description')
    .setVersion('1.0')
    .build();

export default SwaggerOptions;
