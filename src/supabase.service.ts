// src/supabase.service.ts
import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    ) as SupabaseClient;
  }

  async checkDatabaseConnection(): Promise<{ status: string }> {
    try {
      const { error } = await this.supabase
        .from('timewarp')
        .select('id', { count: 'exact', head: true })
        .limit(1);

      if (error) throw error;

      return { status: 'Подключение к БД активно ✅' };
    } catch (error) {
      // Безопасно извлекаем сообщение об ошибке
      const errorMessage =
        error instanceof Error ? error.message : 'Неизвестная ошибка';

      // Логируем исходную ошибку для отладки
      console.error('Ошибка Supabase:', error);

      throw new Error(`Ошибка подключения к БД: ${errorMessage}`);
    }
  }

  async getAllTimewarpRecords(): Promise<any[]> {
    try {
      const { data, error } = await this.supabase.from('timewarp').select('*'); // Selecting all columns and records

      if (error) throw error;

      return data; // Return the retrieved records
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Неизвестная ошибка';

      console.error('Ошибка Supabase:', error);
      throw new Error(`Ошибка получения записей: ${errorMessage}`);
    }
  }
}
