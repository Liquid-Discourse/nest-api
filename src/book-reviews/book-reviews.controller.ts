import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { BookReviewEntity } from './book-review.entity';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBookReviewDTO } from './book-review.dto';

import { UserEntity } from '../users/user.entity';
import { BookEntity } from '../books/book.entity';

@Controller('book-reviews')
export class BookReviewsController {
  constructor(
    @InjectRepository(BookReviewEntity)
    private readonly bookReviewsRepository: Repository<BookReviewEntity>,

    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,

    @InjectRepository(BookEntity)
    private readonly booksRepository: Repository<BookEntity>,
  ) {}

  @Get()
  getBookReviews(@Param() params): Promise<BookReviewEntity[]> {
    return this.bookReviewsRepository.find({
      relations: ['userWhoReviewed', 'book'], // expand the relations in the result,
    });
  }

  @Post()
  async createBookReview(
    @Body() body: CreateBookReviewDTO,
  ): Promise<BookReviewEntity> {
    const bookReview = new BookReviewEntity();
    bookReview.ratingOutOfTen = body.ratingOutOfTen;

    const sarim = await this.usersRepository.findOne(1);
    const harryPotter = await this.booksRepository.findOne(2);

    bookReview.userWhoReviewed = sarim;
    bookReview.book = harryPotter;

    return this.bookReviewsRepository.save(bookReview);
  }
}
