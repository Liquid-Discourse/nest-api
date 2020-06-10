import { Controller, Get, Post, Param, Body } from '@nestjs/common';

// DTO
import { CreateBookDTO } from './book.dto';

// Database access
import { BookEntity } from './book.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Controller('books')
export class BooksController {
  constructor(
    @InjectRepository(BookEntity)
    private readonly booksRepository: Repository<BookEntity>,
  ) {}

  //how to rank books by reviews
  //how to rank books by number of reviews
  @Get('books')
  getBooks(): Promise<BookEntity[]> {
    return this.booksRepository.find();
  }

  //is this actually giving you the book or just returning a string
  @Get(':bookname')
  getSpecificBook(@Param() params): string {
    return `This action returns book by name: ${params.bookname}`;
  }

  @Post()
  createBook(@Body() body: CreateBookDTO): Promise<BookEntity> {
    const book = new BookEntity();
    book.isbn = body.isbn;
    return this.booksRepository.save(book);
  }
}
