import { Controller, Get } from '@nestjs/common';
import { DestinationsService } from './destinations.service';

@Controller('api/destinations')
export class DestinationsController {
  constructor(private readonly destinationsService: DestinationsService) {}

  @Get()
  async findAll() {
    return await this.destinationsService.findAll();
  }
}
