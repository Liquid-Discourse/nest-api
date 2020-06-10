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
  getBooks(@Param() params): Promise<any> {
    return this.booksRepository.query(`SELECT b.id, b.name FROM book b
    LEFT OUTER JOIN book_review r ON b.id = r."bookId"
    GROUP BY b.id, b.name ORDER BY Count(r."bookId") DESC`);
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
