import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookReviewEntity } from './book-review.entity';
import { BookReviewsController } from './book-reviews.controller';

import { UsersModule } from '../users/users.module';
import { BooksModule } from '../books/books.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookReviewEntity]),
    UsersModule,
    BooksModule,
  ],
  controllers: [BookReviewsController],
  exports: [TypeOrmModule],
})
export class BookReviewsModule {}
