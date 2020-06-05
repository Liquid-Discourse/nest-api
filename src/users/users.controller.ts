import { Controller, Get, Post, Param, Body } from '@nestjs/common';

// Database access
import { UserEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// A DTO is a data transfer object (basically just the stuff submitted in the website form)
// we get validation for free!
export class CreateUserDTO {
  firstName: string;
  twitterID: string;
}

@Controller('users')
export class UsersController {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  @Get()
  getUsers(): Promise<UserEntity[]> {
    return this.usersRepository.find();
  }

  @Get(':username')
  getSpecificUser(@Param() params): string {
    return `This action returns user with username: ${params.username}`;
  }

  @Post()
  createUser(@Body() body: CreateUserDTO): Promise<UserEntity> {
    const user = new UserEntity();
    user.firstName = body.firstName;
    return this.usersRepository.save(user);
  }
}
