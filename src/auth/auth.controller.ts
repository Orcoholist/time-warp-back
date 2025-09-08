import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService, User } from './auth.service';
import { CreateUserDto } from '../dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async register(@Body() createUserDto: CreateUserDto): Promise<{
    user: Omit<User, 'password'>;
    accessToken: string;
  }> {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  )
  async login(@Body() createUserDto: CreateUserDto) {
    return this.authService.login(createUserDto);
  }
}
