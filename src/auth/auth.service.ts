import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../dto/create-user.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

export interface User {
  id?: number;
  username: string;
  password: string;
}
@Injectable()
export class AuthService {
  private users: User[] = [];

  async register(
    createUserDto: CreateUserDto,
  ): Promise<Omit<User, 'password'>> {
    console.log('Received DTO:', createUserDto);

    // Проверка наличия пароля
    if (!createUserDto.password) {
      // Явно указываем тип ошибки через `HttpException`
      throw new HttpException(
        { message: 'Password is required' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user: User = {
      ...createUserDto,
      password: hashedPassword,
    };
    this.users.push(user);
    return this.returnUserWithoutPassword(user);
  }

  async login(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const user = this.users.find(
      (u) =>
        u.username?.toLowerCase() === createUserDto.username?.toLowerCase(),
    );

    // Check if user exists and password is defined
    if (!user || !user.password) {
      throw new HttpException(
        { message: 'Invalid credentials' },
        HttpStatus.UNAUTHORIZED,
      );
    }

    // Await the promise outside the boolean condition
    const passwordsMatch = await bcrypt.compare(
      createUserDto.password,
      user.password,
    );

    if (!passwordsMatch) {
      throw new HttpException(
        { message: 'Invalid credentials' },
        HttpStatus.UNAUTHORIZED,
      );
    }

    return this.returnUserWithoutPassword(user);
  }

  private returnUserWithoutPassword(user: User): Omit<User, 'password'> {
    const { password, ...result } = user;
    console.log(password);

    return result;
  }
}
