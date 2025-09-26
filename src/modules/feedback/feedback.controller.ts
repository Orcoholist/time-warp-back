// src/modules/feedback/feedback.controller.ts
import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { FeedbackDto } from './feedback.dto';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async submitFeedback(@Body() dto: FeedbackDto) {
    await this.feedbackService.sendFeedback(dto);
    return { success: true };
  }
}
