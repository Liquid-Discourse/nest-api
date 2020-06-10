import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';

import { AuthController } from './auth.controller';
import { JWTMiddleware } from './auth.middleware';

@Module({
  imports: [],
  providers: [],
  controllers: [AuthController],
  exports: [],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JWTMiddleware).forRoutes({
      path: 'auth/test',
      method: RequestMethod.ALL,
    });
  }
}
