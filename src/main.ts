// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';

// Загрузите переменные окружения из .env
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Используйте PORT из .env
  const port = process.env.PORT || 3000;

  // Настройка CORS с переменными из .env
  const corsOrigins = process.env.CORS_ORIGINS?.split(',') || [
    'http://localhost:3001',
  ];

  app.enableCors({
    origin: corsOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(port);
}
void bootstrap();
