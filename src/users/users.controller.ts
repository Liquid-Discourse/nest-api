import { Controller, Get, Post, Param, Body } from '@nestjs/common';

// A DTO is a data transfer object (basically just the stuff submitted in the website form)
// we get validation for free!
export class CreateUserDTO {
  name: string;
  twitterID: string;
}

@Controller('users')
export class UsersController {
  @Get()
  findAll(): string {
    return 'This action returns all users';
  }

  @Get(':username')
  userProfile(@Param() params): string {
    return `This action returns user with username: ${params.username}`;
  }

  @Post()
  create(@Body() body: CreateUserDTO): string {
    return `This action adds a new user (maybe via twitter login). POST data includes: ${body.twitterID}`;
  }
}
