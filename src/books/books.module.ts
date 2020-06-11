// import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';

// // JWTMiddleware: protects endpoints with JWT auth
// import { JWTMiddleware } from '../auth/auth.middleware';

// import { BookEntity } from './book.entity';

// // import controllers
// import { BooksController } from './books.controller';

// // import other modules
// import { AuthModule } from '../auth/auth.module';
// import { UsersModule } from '../users/users.module';

// @Module({
//   imports: [
//     // add our BookReviewEntity to TypeORM so it can recognize it
//     TypeOrmModule.forFeature([BookEntity]),

//     // we need functionality from these modules so we import them
//     AuthModule,
//     UsersModule,
//   ],

//   // all the endpoints/routes
//   controllers: [BooksController],

//   // we re-export TypeORM so the repositories can be used elsewhere
//   exports: [TypeOrmModule],
// })
// export class BooksModule {
//   // protect certain routes with JWT auth
//   // i.e. we only want logged in users to be able to create reviews
//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply(JWTMiddleware).forRoutes({
//       path: 'books/', // the path to the route we want to protect
//       method: RequestMethod.POST, // the method e.g. GET, POST or ALL
//     });
//   }
// }

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookEntity } from './book.entity';
import { BooksController } from './books.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BookEntity])],
  controllers: [BooksController],
  exports: [TypeOrmModule],
})
export class BooksModule {}
