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
    // return this.booksRepository
    //   .createQueryBuilder('book')
    //   .leftJoinAndSelect('book.reviews', 'review')
    //   .addSelect('Count(review.id)', 'reviewCount')
    //   .groupBy('book.id, review.id')
    //   .orderBy({
    //     reviewCount: 'DESC',
    //   })
    //   .getMany();

    return this.booksRepository.query(`SELECT b.id, b.name FROM book b
    LEFT OUTER JOIN book_review r ON b.id = r."bookId"
    GROUP BY b.id, b.name ORDER BY Count(r."bookId") DESC`);
  }

  @Get()
  getOneBook(@Param() params): Promise<any> {
    return this.booksRepository.find();
  }

  @Post()
  createBook(@Body() body: CreateBookDTO): Promise<BookEntity> {
    const book = new BookEntity();
    book.name = body.name;
    book.author = body.author;
    book.isbn = body.isbn;
    book.googleId = body.googleId;
    return this.booksRepository.save(book);
  }
}
