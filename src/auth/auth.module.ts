import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';

// AuthController: all our endpoints
import { AuthController } from './auth.controller';

// AuthService: reusable logic lives here
import { AuthService } from './auth.service';

// JWTMiddleware: protects endpoints with JWT auth
import { JWTMiddleware } from './auth.middleware';

@Module({
  // module imports
  imports: [],

  // service imports
  providers: [AuthService],

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
