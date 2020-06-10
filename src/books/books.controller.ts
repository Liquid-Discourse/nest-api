import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { BookEntity } from './book.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBookDTO } from './book.dto';

@Controller('books')
export class BooksController {
  constructor(
    @InjectRepository(BookEntity)
    private readonly booksRepository: Repository<BookEntity>,
  ) {}

  @Get()
  getBooks(@Param() params): Promise<BookEntity[]> {
    // this.booksRepository.createQueryBuilder("book")
    return this.booksRepository.find();
  }

  @Post()
  createBook(@Body() body: CreateBookDTO): Promise<BookEntity> {
    const book = new BookEntity();
    book.name = body.name;
    book.author = body.author;
    book.isbn = body.isbn;
    return this.booksRepository.save(book);
  }
}
