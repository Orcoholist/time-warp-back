import { Module } from '@nestjs/common';
import { SeederService } from '../../src/controllers/seeder.service';
import { SeederController } from './seeder.controller';
import { PrismaService } from '../../src/prisma/prisma.service';

@Module({
  controllers: [SeederController],
  providers: [SeederService, PrismaService],
})
export class SeederModule {}
