import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class TimewarpService {
  constructor(private prisma: PrismaService) {}

  getAllTimewarpRecords(): Promise<Record<string, any>[]> {
    return this.prisma.timewarp.findMany();
  }

  //   async getAllTimewarpRecords(): Promise<Record<string, any>[]> {
  //     const records = await this.prisma.timewarp.findMany();
  //     return records.map((record) => {
  //       // Конвертируем BigInt в строку
  //       return Object.entries(record).reduce(
  //         (acc, [key, value]) => {
  //           acc[key] = typeof value === 'bigint' ? value.toString() : value;
  //           return acc;
  //         },
  //         {} as Record<string, any>,
  //       );
  //     });
  //   }
}
