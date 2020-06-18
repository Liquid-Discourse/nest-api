import {
  Module,
  MiddlewareConsumer,
  RequestMethod,
  forwardRef,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// JWTMiddleware: protects endpoints with JWT auth
import { JWTMiddleware } from '../auth/auth.middleware';

import { BookReviewEntity } from './book-review.entity';

// import controllers
import { BookReviewsController } from './book-reviews.controller';

// import services
import { BooksService } from '../books/books.service';

// import other modules
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { BooksModule } from '../books/books.module';
import { TagsModule } from '../tags/tags.module';

@Module({
  imports: [
    // add our BookReviewEntity to TypeORM so it can recognize it
    TypeOrmModule.forFeature([BookReviewEntity]),

    // we need functionality from these modules so we import them
    forwardRef(() => AuthModule),
    forwardRef(() => UsersModule),
    forwardRef(() => BooksModule),
    forwardRef(() => TagsModule),
  ],

  // all the endpoints/routes
  controllers: [BookReviewsController],

  // all the logic
  providers: [BooksService],

  // we re-export TypeORM so the repositories can be used elsewhere
  exports: [TypeOrmModule],
})
export class BookReviewsModule {
  // protect certain routes with JWT auth
  // i.e. we only want logged in users to be able to create reviews
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JWTMiddleware).forRoutes(
      {
        path: 'book-reviews', // the path to the route we want to protect
        method: RequestMethod.POST, // the method e.g. GET, POST or ALL
      },
      {
        path: 'book-reviews', // the path to the route we want to protect
        method: RequestMethod.DELETE, // the method e.g. GET, POST or ALL
      },
    );
  }
}
