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
    await this.bookReviewsRepository.remove(bookReview);
    await this.onBookReviewChange(bookReview);
    return bookReview;
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
    if (!bookReview) {
      bookReview = new BookReviewEntity();
    }
    // update basic information
    bookReview.userWhoReviewed = userCreatingTheReview;
    bookReview.book = bookBeingReviewed;
    Object.keys(body).forEach(key => {
      bookReview[key] = body[key];
    });
    // update relational information
    if (body.suggestedTags) {
      bookReview.suggestedTags = [];
      const tagEntities = await Promise.all(
        body.suggestedTags.map(tagId => this.tagsRepository.findOne(tagId)),
      );
      bookReview.suggestedTags = tagEntities;
    }

    // save
    const response = await this.bookReviewsRepository.save(bookReview);

    // callback to allow for updates
    await this.onBookReviewChange(response);

    // return
    return response;
  }

  async onBookReviewChange(bookReview: BookReviewEntity) {
    // update the book
    await this.updateBookHelper(bookReview.book.id);
    // update the tags
    if (bookReview.suggestedTags) {
      this.updateTagsHelper(bookReview.suggestedTags.map(t => t.id));
    }
  }

  async updateBookHelper(bookId: number) {
    // get the book
    const book = await this.booksRepository.findOne({
      relations: ['tags'],
      where: {
        id: bookId,
      },
    });
    if (!book) {
      return;
    }

    // get all the reviews for this book
    const [
      reviews,
      reviewCount,
    ] = await this.bookReviewsRepository.findAndCount({
      relations: ['book', 'suggestedTags'],
      where: {
        book: {
          id: bookId,
        },
      },
    });

    // update the reviewCount
    book.reviewCount = reviewCount;

    // update the average rating
    let ratingTally = 0;
    reviews.forEach(review => {
      ratingTally += review.ratingOutOfTen;
    });
    if (reviewCount > 0) {
      book.averageRatingOutOfTen = ratingTally / reviewCount;
    }

    // get all the tags for the book
    let collectTagIds: number[] = [];
    reviews.forEach(review => {
      collectTagIds = [
        ...collectTagIds,
        ...review.suggestedTags.map(tag => tag.id),
      ];
    });
    collectTagIds = Array.from(new Set(collectTagIds));
    console.log(collectTagIds);
    const finalTags: TagEntity[] = await Promise.all(
      collectTagIds.map(id => this.tagsRepository.findOne(id)),
    );
    book.tags = finalTags;

    // save the book
    await this.booksRepository.save(book);
  }

  async updateTagsHelper(tagIds: number[]) {
    tagIds.forEach(tag => {
      this.updateTagHelper(tag);
    });
  }

  async updateTagHelper(tagId: number) {
    // we want to get the number of books for this tag
    const tag = await this.tagsRepository.findOne({
      relations: ['books'],
      where: {
        id: tagId,
      },
    });
    if (!tag) {
      return;
    }
    if (tag?.books?.length) {
      console.log('new length', tag.books.length);
      tag.bookCount = tag.books.length;
    }
    await this.tagsRepository.save(tag);
  }
}
