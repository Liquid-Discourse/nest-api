import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { BookEntity } from './book.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBookDTO, QueryBookDTO } from './book.dto';

// Documentation
import { ApiOperation } from '@nestjs/swagger';

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
    return this.booksRepository.find(options);
  }

  @Post('getonebook')
  @ApiOperation({
    summary: 'Get a specific book review by its ID *PENDING CHANGE TO GET*',
    description: 'Get a specific book review by its ID *PENDING CHANGE TO GET*',
  })
  async getOneBook(@Body() body): Promise<any> {
    let check = await this.booksRepository.findOne({
      relations: [
        'tags',
        'usersWhoListedOnBookShelf',
        'reviews',
        'reviews.userWhoReviewed',
      ],
      where: {
        isbn: body.isbn,
      },
    });
    return check;
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
