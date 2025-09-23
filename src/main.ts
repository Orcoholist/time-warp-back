// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Загрузите переменные окружения из .env
dotenv.config();

// Создаем экземпляр Supabase клиента
const supabase = createClient(
  String(process.env.SUPABASE_URL!),
  String(process.env.SUPABASE_ANON_KEY!),
);

interface SupabaseRequest extends Request {
  supabase: SupabaseClient;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app
    .getHttpAdapter()
    .getInstance()
    .use((req: SupabaseRequest, res, next) => {
      req.supabase = supabase;
      next();
    });

  const port = process.env.PORT || 3000;

  const corsOrigins = process.env.CORS_ORIGINS?.split(',') || [
    'http://localhost:3001', // Локальный фронтенд
    'https://time-warp-rxs7.vercel.app', //  фронтенд
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
  // app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(port);
}
void bootstrap();
