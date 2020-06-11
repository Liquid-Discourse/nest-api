import {
  Module,
  forwardRef,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';

// entities import
import { UserEntity } from './user.entity';

// controllers import
import { UsersController } from './users.controller';

// services import
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';

// JWTMiddleware: protects endpoints with JWT auth
import { JWTMiddleware } from '../auth/auth.middleware';

@Module({
  // module imports
  imports: [
    // the typeorm library is modified to accept our user entity
    TypeOrmModule.forFeature([UserEntity]),
    // we do a forwardRef to break a circular dependency with
    // AuthModule, which imports UsersModule
    forwardRef(() => AuthModule),
  ],

  // services provide the functionality. we import the UsersService (within this
  // module) and other services external to this module
  providers: [UsersService, AuthService],

  // the endpoints for the user module
  controllers: [UsersController],

  // all the things I want to share with other modules, in this case the
  // modified TypeOrm and the UsersService logic
  exports: [TypeOrmModule, UsersService],
})
export class UsersModule {
  // protect certain routes with JWT auth
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JWTMiddleware).forRoutes(
      {
        path: 'users/settings', // the path to the route we want to protect
        method: RequestMethod.ALL, // the method e.g. GET, POST or ALL
      },
      {
        path: 'users', // the path to the route we want to protect
        method: RequestMethod.POST, // the method e.g. GET, POST or ALL
      },
    );
  }
}
