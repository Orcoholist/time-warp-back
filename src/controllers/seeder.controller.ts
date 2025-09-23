import { Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { SeederService } from '../../src/controllers/seeder.service';

@Controller('seed')
export class SeederController {
  constructor(private readonly seederService: SeederService) {}

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  async seed() {
    await this.seederService.seedAll();
  }
}
