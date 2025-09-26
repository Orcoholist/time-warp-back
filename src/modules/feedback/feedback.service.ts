import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class FeedbackService {
  constructor(private readonly mailerService: MailerService) {}

  async sendFeedback({
    name,
    email,
    message,
  }: {
    name: string;
    email: string;
    message: string;
  }) {
    await this.mailerService.sendMail({
      to: process.env.ADMIN_EMAIL, // Ваш email
      from: email,
      subject: `Новое сообщение от ${name}`,
      text: `Имя: ${name}\nEmail: ${email}\nСообщение: ${message}`,
      html: `<h2>Новое сообщение:</h2><p><strong>Имя:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Сообщение:</strong></p><p>${message.replace(/\n/g, '<br/>')}</p>`,
    });
  }
}
