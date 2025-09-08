// src/controllers/users.controller.ts
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';

@Controller('users')
export class UsersController {
  @Get()
  getAllUsers() {
    return { users: ['User1', 'User2'] };
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
    return { user: `ID ${id}` };
  }

  @Post('create')
  createUser(@Body() user: CreateUserDto) {
    // Замена any на UserDto
    return {
      message: 'Пользователь создан',
      user,
    };
  }
}
