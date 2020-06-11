import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Req,
  Delete,
} from '@nestjs/common';
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

  @Get(':reviewId')
  async getBookReview(@Param() params): Promise<BookReviewEntity> {
    return this.bookReviewsRepository.findOne({
      relations: ['userWhoReviewed', 'book'],
      where: {
        id: params.reviewId,
      },
    });
  }

  @Delete(':reviewId')
  async deleteBookReview(
    @Req() req,
    @Param() params,
  ): Promise<BookReviewEntity> {
    // get user from JWT token
    const userWhoReviewed = await this.usersRepository.findOne({
      where: {
        auth0Id: req?.user?.sub,
      },
    });
    // get review
    const reviewId = params.reviewId;
    const bookReview = await this.bookReviewsRepository.findOne({
      relations: ['userWhoReviewed', 'book'],
      where: {
        id: reviewId,
        userWhoReviewed: userWhoReviewed,
      },
    });
    // remove it
    return this.bookReviewsRepository.remove(bookReview);
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
    // check if review already exists
    let bookReview: BookReviewEntity;
    bookReview = await this.bookReviewsRepository.findOne({
      relations: ['userWhoReviewed', 'book'],
      where: {
        userWhoReviewed: userCreatingTheReview,
        book: bookBeingReviewed,
      },
    });
    // if exists, just update rating, otherwise create anew
    if (await bookReview) {
      bookReview.ratingOutOfTen = body.ratingOutOfTen;
    } else {
      bookReview = new BookReviewEntity();
      bookReview.ratingOutOfTen = body.ratingOutOfTen;
      bookReview.userWhoReviewed = userCreatingTheReview;
      bookReview.book = bookBeingReviewed;
    }
    // save
    return this.bookReviewsRepository.save(bookReview);
  }
}
