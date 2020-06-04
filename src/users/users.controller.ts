import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from './user.dto';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getUsers(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':username')
  getSpecificUser(@Param() params): string {
    return `This action returns user with username: ${params.username}`;
  }

  @Post()
  createUser(@Body() body: CreateUserDTO): Promise<User> {
    return this.usersService.create(body);
    // return `This action adds a new user (maybe via twitter login). POST data includes: ${body.twitterID}`;
  }
}
