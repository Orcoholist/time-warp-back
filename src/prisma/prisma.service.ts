import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { directions } from '../../prisma/data';

@Injectable()
export class PrismaService extends PrismaClient {
  async seedData() {
    for (const direction of directions) {
      await this.direction.upsert({
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
    console.log('Database seeded');
  }
}
