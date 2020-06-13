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
    // order by review count
    return this.booksRepository.find({
      relations: ['tags', 'reviews'],
      order: {
        reviewCount: 'DESC',
      },
    });
  }

  @Post('getonebook')
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

  //how to make an array of suthors
  @Post()
  createBook(@Body() body: CreateBookDTO): Promise<BookEntity> {
    const book = new BookEntity();
    book.name = body.name;
    book.authors = body.authors;
    book.isbn = body.isbn;
    return this.booksRepository.save(book);
  }
}
