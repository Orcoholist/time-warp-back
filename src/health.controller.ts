// src/health.controller.ts
import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { SupabaseService } from './supabase.service';

@Controller('health')
export class HealthController {
  constructor(private readonly supabaseService: SupabaseService) {}

  @Get()
  async checkDatabaseHealth() {
    try {
      const result = await this.supabaseService.checkDatabaseConnection();
      return result;
    } catch (error) {
      // Безопасно извлекаем сообщение об ошибке
      const errorMessage =
        error instanceof Error ? error.message : 'Неизвестная ошибка';

      throw new HttpException(
        `Ошибка проверки БД: ${errorMessage}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('timewarp')
  async getTimewarpData(): Promise<any> {
    try {
      const records = await this.supabaseService.getAllTimewarpRecords();

      return records; // Возвращаем все записи
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        throw new HttpException(
          'Неизвестная ошибка',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
