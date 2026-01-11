import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import cookie from '@fastify/cookie';
import multipart from '@fastify/multipart';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // Register cookie plugin
  await app.register(cookie, {
    secret: process.env.COOKIE_SECRET || 'cookie-secret', // for signed cookies
  });

  // Register multipart plugin
  await app.register(multipart, {
    limits: {
      fieldNameSize: 100, // Max field name size in bytes
      fieldSize: 100, // Max field value size in bytes
      fields: 10, // Max number of non-file fields
      fileSize: 10 * 1024 * 1024, // 10MB
      files: 1, // Max number of file fields
    },
  });

  // Enable CORS
  app.enableCors({
    origin: true, // Reflect the request origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  // Global Validation Pipe
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Set global prefix
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Student Track Record API')
    .setDescription('API documentation for the Student Track Record system')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000, '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`);
}
void bootstrap();
