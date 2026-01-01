import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // Register cookie plugin
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  await app.register(require('@fastify/cookie'), {
    secret: process.env.COOKIE_SECRET || 'cookie-secret', // for signed cookies
  });

  // Enable CORS
  app.enableCors();

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
