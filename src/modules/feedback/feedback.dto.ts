import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class FeedbackDto {
  @IsString()
  @IsNotEmpty()
  name: string = '';

  @IsEmail()
  email: string = '';

  @IsString()
  @IsNotEmpty()
  message: string = '';
}
