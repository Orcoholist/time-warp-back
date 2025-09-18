// src/app.module.ts
import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { RateLimitMiddleware } from './middleware/rate-limit.middleware';
import { AuthModule } from './auth/auth.module';
import { SupabaseService } from './supabase.service'; // ← Добавлено
import { HealthController } from './health.controller'; // ← Добавлено
import { AuthMiddleware } from './middleware/auth.middleware';

@Module({
  imports: [AuthModule],
  providers: [SupabaseService], // ← Добавлено
  controllers: [HealthController], // ← Добавлено
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
