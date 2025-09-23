import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Делает модуль глобальным (не нужно импортировать в каждом модуле)
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
