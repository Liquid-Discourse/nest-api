import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

// swagger for self-documenting code
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

// manage env variables
import * as dotenv from 'dotenv';

// read in all the env variables
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // allow access from anywhere
  // TODO: allow access from only the production frontend and localhost in the future
  app.enableCors();

  // automatically generate docs at http://<api-domain>/docs
  const options = new DocumentBuilder()
    .setTitle('Liquid Discourse API')
    .setDescription('All the endpoints and their parameters')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  // start app
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
