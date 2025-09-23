import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { directions } from '../../prisma/data';

@Injectable()
export class SeederService {
  constructor(private readonly prisma: PrismaService) {}

  async seedDirections() {
    for (const direction of directions) {
      await this.prisma.direction.upsert({
        where: { id: direction.id },
        update: {},
        create: {
          id: direction.id,
          name: direction.name,
          year: direction.year,
          description: direction.description,
        },
      });
    }
    console.log('Directions seeded');
  }

  async seedAll() {
    await this.seedDirections();
    // Добавьте другие методы для других таблиц при необходимости
  }
}
