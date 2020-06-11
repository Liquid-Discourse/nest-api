import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookEntity } from './book.entity';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { BookReviewsModule } from '../book-reviews/book-reviews.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookEntity]),
    forwardRef(() => BookReviewsModule),
  ],
  controllers: [BooksController],
  providers: [BooksService],
  exports: [TypeOrmModule, BooksService],
})
export class BooksModule {}
