// src/modules/feedback/feedback.controller.ts
import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { FeedbackDto } from './feedback.dto';

@Controller('feedback')
export class FeedbackController {
  private readonly logger = new Logger(FeedbackController.name);

  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async submitFeedback(@Body() dto: FeedbackDto) {
    try {
      this.logger.log(`Полученные данные: ${JSON.stringify(dto)}`);
      await this.feedbackService.sendFeedback(dto);
      return { success: true };
    } catch (error: any) {
      this.logger.error('Ошибка при отправке сообщения', error.stack);
      throw new HttpException(
        'Не удалось отправить сообщение',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
