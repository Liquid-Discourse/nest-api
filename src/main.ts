import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// swagger for self-documenting code
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// env variables
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const options = new DocumentBuilder()
    .setTitle('Liquid Discourse API')
    .setDescription('All the endpoints and their parameters')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
