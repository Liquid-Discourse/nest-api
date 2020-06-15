import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Query,
  Req,
  Delete,
} from '@nestjs/common';
import { BookReviewEntity } from './book-review.entity';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  CreateBookReviewDTO,
  QueryBookReviewDTO,
  DeleteBookReviewDTO,
} from './book-review.dto';

import { UserEntity } from '../users/user.entity';
import { BookEntity } from '../books/book.entity';
import { TagEntity } from '../tags/tag.entity';

// Documentation
import { ApiOperation, ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('book-reviews')
@Controller('book-reviews')
export class BookReviewsController {
  constructor(
    @InjectRepository(BookReviewEntity)
    private readonly bookReviewsRepository: Repository<BookReviewEntity>,

    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,

    @InjectRepository(BookEntity)
    private readonly booksRepository: Repository<BookEntity>,

    @InjectRepository(TagEntity)
    private readonly tagsRepository: Repository<TagEntity>,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Query for book reviews',
    description:
      'Query for book reviews. Supply optional parameters (below) to filter your search',
  })
  getBookReviews(
    @Query() query: QueryBookReviewDTO,
  ): Promise<BookReviewEntity[]> {
    const options = {
      relations: ['userWhoReviewed', 'book', 'suggestedTags'], // expand the relations in the result
    };
    if (query.bookId) {
      options['where'] = {
        book: {
          id: query.bookId,
        },
      };
    }
    if (query.userId) {
      options['where'] = {
        ...options['where'],
        userWhoReviewed: {
          id: query.userId,
        },
      };
    }
    return this.bookReviewsRepository.find(options);
  }

  @Get(':reviewId')
  @ApiOperation({
    summary: 'Get a specific book review by its ID',
    description: 'Get a specific book review by its ID',
  })
  async getBookReview(@Param() params): Promise<BookReviewEntity> {
    return this.bookReviewsRepository.findOne({
      relations: ['userWhoReviewed', 'book', 'suggestedTags'],
      where: {
        id: params.reviewId,
      },
    });
  }

  @Delete()
  @ApiOperation({
    summary: 'Delete a specific book review by its ID. Requires user token',
    description: 'Delete a specific book review by its ID. Requires user token',
  })
  @ApiBearerAuth()
  async deleteBookReview(
    @Req() req,
    @Body() body: DeleteBookReviewDTO,
  ): Promise<BookReviewEntity> {
    // get user from JWT token
    const userWhoReviewed = await this.usersRepository.findOne({
      where: {
        auth0Id: req?.user?.sub,
      },
    });
    // get review
    const reviewId = body.reviewId;
    const bookReview = await this.bookReviewsRepository.findOne({
      relations: ['userWhoReviewed', 'book', 'suggestedTags'],
      where: {
        id: reviewId,
        userWhoReviewed: userWhoReviewed,
      },
    });
    // remove it
    return this.bookReviewsRepository.remove(bookReview);
  }

  @Post()
  @ApiOperation({
    summary:
      'Create a new book review. Posting repeatedly with same bookId and token updates the review. Requires user token',
    description:
      'Create a new book review. Posting repeatedly with same bookId and token updates the review. Requires user token',
  })
  @ApiBearerAuth()
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
      relations: ['userWhoReviewed', 'book', 'suggestedTags'],
      where: {
        userWhoReviewed: userCreatingTheReview,
        book: bookBeingReviewed,
      },
    });
    // if not exists, create new review
    if (!(await bookReview)) {
      bookReview = new BookReviewEntity();
    }
    // update information
    bookReview.userWhoReviewed = userCreatingTheReview;
    bookReview.book = bookBeingReviewed;
    if (await !bookReview.suggestedTags) {
      bookReview.suggestedTags = [];
    }
    Object.keys(body).forEach(async key => {
      if (key === 'suggestedTags') {
        // update suggested tags
        body.suggestedTags.forEach(async tagId => {
          const tag = await this.tagsRepository.findOne({
            where: {
              id: tagId,
            },
          });
          if (await tag) {
            if (await !bookReview.suggestedTags.includes(tag)) {
              await bookReview.suggestedTags.push(tag);
            }
          }
        });
      } else {
        // update other properties
        bookReview[key] = body[key];
      }
    });
    // save
    return this.bookReviewsRepository.save(bookReview);
  }
}
