import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DestinationsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.direction.findMany(); // ✅ New (correct if model is now 'Direction')
  }
}
