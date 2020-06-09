import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookReviewEntity } from './book-review.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BookReviewEntity])],
})
export class BookReviewsModule {}
