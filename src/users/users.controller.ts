import { Controller, Get, Post, Param, Body } from '@nestjs/common';

// DTO
import { CreateUserDTO } from './user.dto';

// Database access
import { UserEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Controller('users')
export class UsersController {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  @Get()
  getUsers(): Promise<UserEntity[]> {
    return this.usersRepository.find({});
  }

  @Get(':username')
  getSpecificUser(@Param() params): string {
    return `This action returns user with username: ${params.username}`;
  }

  @Post()
  createUser(@Body() body: CreateUserDTO): Promise<UserEntity> {
    const user = new UserEntity();
    user.emailAddress = body.emailAddress;
    return this.usersRepository.save(user);
  }
}
