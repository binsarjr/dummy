import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  type NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Dummy API')
    .setVersion('0.0.0')
    .setDescription(
      'API untuk dummy data. Mirip seperti https://jsonplaceholder.typicode.com',
    )
    .addApiKey(
      {
        name: 'x-api-key',
        description: 'API Key',
        type: 'apiKey',
      },
      'apikey',
    )
    .addTag('users', 'CRUD data User')
    .addTag('todos', 'CRUD data Todo')
    .addTag('posts', 'CRUD data Post')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
