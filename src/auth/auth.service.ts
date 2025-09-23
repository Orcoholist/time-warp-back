import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, JwtPayload } from '../dto/create-user.dto';
import { PrismaService } from '../../src/prisma/prisma.service';
import * as jwt from 'jsonwebtoken';

export interface User {
  id: number;
  username: string;
  password?: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly jwtSecret = process.env.JWT_SECRET || 'default-secret';

  generateToken(payload: JwtPayload): string {
    return jwt.sign(payload, this.jwtSecret, { expiresIn: '1w' });
  }

  async register(
    createUserDto: CreateUserDto,
  ): Promise<{ user: Omit<User, 'password'>; accessToken: string }> {
    if (!createUserDto.password) {
      throw new HttpException(
        { message: 'Password is required' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { username: createUserDto.username.toLowerCase() },
    });

    if (existingUser) {
      throw new HttpException(
        { message: 'User already exists' },
        HttpStatus.CONFLICT,
      );
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const newUser = await this.prisma.user.create({
      data: {
        username: createUserDto.username.toLowerCase(),
        password: hashedPassword,
      },
    });

    const userWithoutPassword = this.returnUserWithoutPassword(newUser);

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
    const user = await this.prisma.user.findUnique({
      where: { username: createUserDto.username.toLowerCase() },
    });

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
      id: userWithoutPassword.id,
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
