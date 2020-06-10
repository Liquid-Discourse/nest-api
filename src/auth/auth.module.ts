import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
  forwardRef,
} from '@nestjs/common';

// UserModule: in order to import UsersService (below)
import { UsersModule } from '../users/users.module';

// AuthController: all our endpoints
import { AuthController } from './auth.controller';

// AuthService and UsersService: reusable logic lives here
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

// JWTMiddleware: protects endpoints with JWT auth
import { JWTMiddleware } from './auth.middleware';

@Module({
  // module imports. we do a forwardRef to break a circular dependency with
  // UsersModule, which imports AuthModule
  imports: [forwardRef(() => UsersModule)],

  // service imports
  providers: [AuthService, UsersService],

  // controller imports
  controllers: [AuthController],

  // re-exports for other modules' usage
  exports: [AuthService],
})
export class AuthModule implements NestModule {
  // protect certain routes with JWT auth
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JWTMiddleware).forRoutes({
      path: 'auth/test', // the path to the route we want to protect
      method: RequestMethod.ALL, // the method e.g. GET, POST or ALL
    });
  }
}
