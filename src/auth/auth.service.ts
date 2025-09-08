import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, JwtPayload } from '../dto/create-user.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

export interface User {
  id?: number;
  username: string;
  password: string;
}
@Injectable()
export class AuthService {
  private users: User[] = [];

  private readonly jwtSecret = process.env.JWT_SECRET || 'default-secret';

  generateToken(payload: JwtPayload): string {
    return jwt.sign(payload, this.jwtSecret, { expiresIn: '1w' });
  }

  async register(
    createUserDto: CreateUserDto,
  ): Promise<{ user: Omit<User, 'password'>; accessToken: string }> {
    console.log('Received DTO:', createUserDto);

    if (!createUserDto.password) {
      throw new HttpException(
        { message: 'Password is required' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser: User = {
      ...createUserDto,
      password: hashedPassword,
      id: this.users.length + 1, // Автоматическое присвоение ID
    };
    this.users.push(newUser);
    const userWithoutPassword = this.returnUserWithoutPassword(newUser);

    // Генерация токена
    const accessToken = this.generateToken({
      username: userWithoutPassword.username,
      id: userWithoutPassword.id,
    });

    return {
      user: userWithoutPassword,
      accessToken,
    };
  }

  async login(
    createUserDto: CreateUserDto,
  ): Promise<{ user: Omit<User, 'password'>; accessToken: string }> {
    const user = this.users.find(
      (u) =>
        u.username?.toLowerCase() === createUserDto.username?.toLowerCase(),
    );

    if (!user || !user.password) {
      throw new HttpException(
        { message: 'Invalid credentials' },
        HttpStatus.UNAUTHORIZED,
      );
    }

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

    const userWithoutPassword = this.returnUserWithoutPassword(user);
    const accessToken = this.generateToken({
      username: userWithoutPassword.username,
      id: userWithoutPassword.id, // Если есть ID
    });

    return {
      user: userWithoutPassword,
      accessToken,
    };
  }

  private returnUserWithoutPassword(user: User): Omit<User, 'password'> {
    const { password, ...result } = user;
    console.log(password);

    return result;
  }
}
