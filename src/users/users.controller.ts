import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Req,
  Delete,
} from '@nestjs/common';

// Database access
import { UserEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { UsersService } from './users.service';

import { BookShelfDTO, UpdateUserDTO } from './user.dto';
import { BookEntity } from 'src/books/book.entity';

// Documentation
import { ApiOperation, ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
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
  @ApiOperation({
    summary: "Get a specific user's public profile by username",
    description: "Get a specific user's public profile by username",
  })
  getPublicProfile(@Param() params): Promise<UserEntity> {
    return this.usersRepository.findOne({
      relations: [
        'bookReviews',
        'bookReviews.book',
        'preferredTopics',
        'bookShelf',
      ],
      where: {
        username: params.username,
      },
    });
  }

  // getSettings
  // endpoint: /users/settings
  @Get('settings')
  @ApiOperation({
    summary: 'Get all user information. Requires user token',
    description: 'Get all user information. Requires user token',
  })
  @ApiBearerAuth()
  async getSettings(@Req() req): Promise<any> {
    const auth0Metadata = await this.authService.getAuth0Profile(req);
    const dbProfile = await this.usersRepository.findOne({
      relations: ['bookReviews', 'preferredTopics', 'bookShelf'],
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
  @ApiOperation({
    summary: "Query for users' public profiles *NEEDS WORK*",
    description: "Query for users' public profiles *NEEDS WORK*",
  })
  getUsers(): Promise<UserEntity[]> {
    return this.usersRepository.find();
  }

  // createUser: create user from DTO object
  // endpoint: /users
  @Post()
  @ApiOperation({
    summary:
      'Create a new user via Auth0. Cannot be used to update the user. Requires user token',
    description:
      'Create a new user via Auth0. Cannot be used to update the user. Requires user token',
  })
  @ApiBearerAuth()
  createUserIfNotExist(@Req() request): Promise<UserEntity> {
    return this.usersService.createUserIfNotExist(request);
  }

  @Delete()
  @ApiOperation({
    summary: 'Remove a user. Requires user token',
    description: 'Remove a user. Requires user token',
  })
  @ApiBearerAuth()
  async removeUser(@Req() req): Promise<UserEntity> {
    // get user from JWT token
    const user = await this.usersRepository.findOne({
      where: {
        auth0Id: req?.user?.sub,
      },
    });
    // remove it
    return this.usersRepository.remove(user);
  }

  // addToShelf: add to user's shelf if not already present
  // endpoint: /users/shelf
  @Post('shelf')
  @ApiOperation({
    summary: "Add book to user's shelf. Requires user token",
    description: "Add book to user's shelf. Requires user token",
  })
  @ApiBearerAuth()
  addToShelf(@Req() request, @Body() body: BookShelfDTO): Promise<UserEntity> {
    return this.usersService.addToShelf(request, body.bookId);
  }

  // removeFromShelf: delete from user's shelf if present
  // endpoint: /users/shelf
  @Delete('shelf')
  @ApiOperation({
    summary: "Remove book from user's shelf. Requires user token",
    description: "Remove book from user's shelf. Requires user token",
  })
  @ApiBearerAuth()
  removeFromShelf(
    @Req() request,
    @Body() body: BookShelfDTO,
  ): Promise<UserEntity> {
    return this.usersService.removeFromShelf(request, body.bookId);
  }

  @Patch()
  @ApiOperation({
    summary: 'Update a user. Requires user token',
    description: 'Update a user. Requires user token',
  })
  @ApiBearerAuth()
  async updateUser(
    @Req() request,
    @Body() body: UpdateUserDTO,
  ): Promise<UserEntity> {
    console.log(body);
    // get user
    const user = await this.usersRepository.findOne({
      where: {
        auth0Id: request?.user?.sub,
      },
    });
    if (await !user) {
      return;
    }
    // update properties
    Object.keys(body).forEach(key => {
      user[key] = body[key];
    });
    return this.usersRepository.save(user);
  }
}
