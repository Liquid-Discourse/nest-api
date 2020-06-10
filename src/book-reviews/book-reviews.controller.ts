import { Controller, Get, Param, Post, Body, Req } from '@nestjs/common';
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
      relations: ['userWhoReviewed', 'book'], // expand the relations in the result
    });
  }

  @Post()
  async createBookReview(
    @Req() req,
    @Body() body: CreateBookReviewDTO,
  ): Promise<BookReviewEntity> {
    // get user from JWT token
    const userCreatingTheReview = await this.usersRepository.findOne({
      where: {
        auth0Id: req?.user?.sub,
      },
    });
    // get book
    const bookBeingReviewed = await this.booksRepository.findOne({
      where: {
        id: body.bookId,
      },
    });
    // create review
    const bookReview = new BookReviewEntity();
    bookReview.ratingOutOfTen = body.ratingOutOfTen;
    bookReview.userWhoReviewed = userCreatingTheReview;
    bookReview.book = bookBeingReviewed;
    // save
    return this.bookReviewsRepository.save(bookReview);
  }
}
