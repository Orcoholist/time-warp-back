import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { RateLimitMiddleware } from './middleware/rate-limit.middleware';
import { AuthModule } from './modules/auth/auth.module';
import { SupabaseService } from './supabase.service';
import { HealthController } from './health.controller';
import { AuthMiddleware } from './middleware/auth.middleware';
import { PrismaService } from './prisma/prisma.service';
import { TimewarpService } from './timewarp.service';
import { BigIntInterceptor } from './big-int/big-int.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { SeederModule } from './controllers/seeder.module';
import { FeedbackController } from './modules/feedback/feedback.controller';
import { FeedbackService } from './modules/feedback/feedback.service';
import { FeedbackModule } from './modules/feedback/feedback.module';
import { DestinationsModule } from './modules/destinations/destinations.module';

@Module({
  imports: [
    // ✅ Добавлен MailerModule с асинхронной конфигурацией
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('EMAIL_HOST'),
          port: configService.get<number>('EMAIL_PORT'),
          secure: true,
          auth: {
            user: configService.get<string>('EMAIL_USER'),
            pass: configService.get<string>('EMAIL_PASS'),
          },
        },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    SeederModule,
    FeedbackModule,
    DestinationsModule,
  ],
  providers: [
    SupabaseService,
    PrismaService,
    TimewarpService,
    FeedbackService,
    { provide: APP_INTERCEPTOR, useClass: BigIntInterceptor },
  ],
  controllers: [HealthController, FeedbackController],
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
