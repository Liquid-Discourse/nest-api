import { Controller, Get, Post, Param, Body, Req } from '@nestjs/common';

// Database access
import { UserEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,

    private authService: AuthService,

    private usersService: UsersService,
  ) {}

  // getPublicProfile: get specific user profile by their username
  // endpoint: /users/profile/:username
  @Get('profile/:username')
  getPublicProfile(@Param() params): Promise<UserEntity> {
    return this.usersRepository.findOne({
      relations: ['bookReviews', 'bookReviews.book', 'preferredTopics'],
      where: {
        username: params.username,
      },
    });
  }

  // getSettings
  // endpoint: /users/settings
  @Get('settings')
  async getSettings(@Req() req): Promise<any> {
    const auth0Metadata = await this.authService.getAuth0Profile(req);
    const dbProfile = await this.usersRepository.findOne({
      relations: ['bookReviews', 'preferredTopics'],
      where: {
        auth0Id: req?.user?.sub,
      },
    });
    return {
      database: dbProfile,
      auth0: auth0Metadata,
    };
  }

  // getUsers: get all users
  // endpoint: /users
  @Get()
  getUsers(): Promise<UserEntity[]> {
    return this.usersRepository.find({});
  }

  // createUser: create user from DTO object
  // endpoint: /users
  @Post()
  createUserIfNotExist(@Req() request): Promise<UserEntity> {
    return this.usersService.createUserIfNotExist(request);
  }
}
