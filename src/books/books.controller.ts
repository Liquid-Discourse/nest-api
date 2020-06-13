import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { BookEntity } from './book.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBookDTO, QueryBookDTO } from './book.dto';

// Documentation
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('books')
@Controller('books')
export class BooksController {
  constructor(
    @InjectRepository(BookEntity)
    private readonly booksRepository: Repository<BookEntity>,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Query for books',
    description:
      'Query for books. Supply optional parameters (below) to filter your search',
  })
  getBooks(@Query() query: QueryBookDTO): Promise<any> {
    // init options
    const options = {
      relations: ['tags', 'reviews'],
    };
    // optional ordering options
    if (query.order) {
      options['order'] = {
        [query.order]: query.orderDirection ? query.orderDirection : 'DESC',
      };
    }
    if (query.isbn) {
      options['where'] = {
        isbn: query.isbn,
      };
    }
    return this.booksRepository.find(options);
  }

  @Get(':bookId')
  @ApiOperation({
    summary: 'Get a specific book review by its ID',
    description: 'Get a specific book review by its ID',
  })
  async getBook(@Param() params): Promise<any> {
    return this.booksRepository.findOne({
      relations: [
        'tags',
        'usersWhoListedOnBookShelf',
        'reviews',
        'reviews.userWhoReviewed',
      ],
      where: {
        id: params.bookId,
      },
    });
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new book',
    description: 'Create a new book',
  })
  createBook(@Body() body: CreateBookDTO): Promise<BookEntity> {
    const book = new BookEntity();
    book.name = body.name;
    book.authors = body.authors;
    book.isbn = body.isbn;
    return this.booksRepository.save(book);
  }
}
