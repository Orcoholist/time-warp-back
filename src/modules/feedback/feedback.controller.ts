// src/modules/feedback/feedback.controller.ts
import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { FeedbackDto } from './feedback.dto';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  @UsePipes(new ValidationPipe()) // Валидация только основных полей
  async submitFeedback(
    @Body() dto: FeedbackDto,
    @Body('botField') botField: string,
  ) {
    // Проверка honeypot поля
    if (botField && botField.trim() !== '') {
      throw new HttpException(
        'Запрещено заполнять скрытое поле',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.feedbackService.sendFeedback(dto);
    return { success: true };
  }
}
