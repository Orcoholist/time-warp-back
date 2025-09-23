// src/app.module.ts
import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { RateLimitMiddleware } from './middleware/rate-limit.middleware';
import { AuthModule } from './auth/auth.module';
import { SupabaseService } from './supabase.service'; // ← Добавлено
import { HealthController } from './health.controller'; // ← Добавлено
import { AuthMiddleware } from './middleware/auth.middleware';
import { PrismaService } from './prisma/prisma.service';
import { TimewarpService } from './timewarp.service';
import { BigIntInterceptor } from './big-int/big-int.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { SeederModule } from './controllers/seeder.module';

@Module({
  imports: [AuthModule, SeederModule],
  providers: [
    SupabaseService,
    PrismaService,
    TimewarpService,
    { provide: APP_INTERCEPTOR, useClass: BigIntInterceptor },
  ], // ← Добавлено
  controllers: [HealthController], // ← Добавлено
  exports: [PrismaService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware, RateLimitMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });

    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'users', method: RequestMethod.ALL },
        { path: 'profile', method: RequestMethod.ALL },
      );
  }
}
