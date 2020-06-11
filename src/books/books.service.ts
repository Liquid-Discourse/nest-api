// Injectable means that this service can be injected into other controllers and
// services
import { Injectable } from '@nestjs/common';

// InjectRepository is a way to inject typeorm entity as a repository variable
// with a connection to the database
import { InjectRepository } from '@nestjs/typeorm';

// Repository is just a TypeScript type
import { Repository } from 'typeorm';

// import entities
import { BookEntity } from './book.entity';

@Injectable()
export class BooksService {
  // this shorthand constructor creates class members for us and initializes
  // them in the same statement
  constructor(
    //  we inject the BookEntity as a repository
    @InjectRepository(BookEntity)
    private readonly booksRepository: Repository<BookEntity>,
  ) {}
}
