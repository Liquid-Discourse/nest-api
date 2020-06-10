import { Controller, Get, Post, Param, Body, Req } from '@nestjs/common';

// DTO
import { CreateUserDTO } from './user.dto';

// Database access
import { UserEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';

@Controller('users')
export class UsersController {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,

    private authService: AuthService,
  ) {}

  // getUsers: get all users
  @Get()
  getUsers(): Promise<UserEntity[]> {
    return this.usersRepository.find({});
  }

  // getPublicProfile: get specific user profile by their username
  @Get('@/:username')
  getPublicProfile(@Param() params): Promise<UserEntity> {
    return this.usersRepository.findOne({
      relations: ['bookReviews', 'preferredTopics'],
      where: {
        username: params.username,
      },
    });
  }

  // getFullProfile
  @Get('profile')
  async getFullProfile(@Req() req): Promise<any> {
    const dbProfile = await this.usersRepository.findOne({
      relations: ['bookReviews', 'preferredTopics'],
      where: {
        auth0Id: req?.user?.sub,
      },
    });
    const auth0Metadata = await this.authService.getAuth0Profile(req);
    return {
      database: dbProfile,
      auth0: auth0Metadata,
    };
  }

  // createUser: create user from DTO object
  @Post()
  createUser(@Body() body: CreateUserDTO): Promise<UserEntity> {
    return this.usersRepository.save(body);
  }
}
