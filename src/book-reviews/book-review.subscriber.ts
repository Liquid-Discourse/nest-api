import { InjectRepository } from '@nestjs/typeorm';
import {
  Connection,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
  Repository,
} from 'typeorm';

import { BookReviewEntity } from './book-review.entity';
import { BookEntity } from '../books/book.entity';

@EventSubscriber()
export class BookReviewSubscriber
  implements EntitySubscriberInterface<BookReviewEntity> {
  constructor(
    connection: Connection,

    @InjectRepository(BookEntity)
    private readonly booksRepository: Repository<BookEntity>,

    @InjectRepository(BookReviewEntity)
    private readonly bookReviewsRepository: Repository<BookReviewEntity>,
  ) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return BookReviewEntity;
  }

  async afterInsert(event: InsertEvent<BookReviewEntity>) {
    this.updateBookInformation(event.entity.book.id);
  }

  async afterRemove(event: RemoveEvent<BookReviewEntity>) {
    this.updateBookInformation(event.entity.book.id);
  }

  async afterUpdate(event: UpdateEvent<BookReviewEntity>) {
    this.updateBookInformation(event.entity.book.id);
  }

  async updateBookInformation(bookId: number) {
    // get all the reviews for this book
    const [
      reviews,
      reviewCount,
    ] = await this.bookReviewsRepository.findAndCount({
      relations: ['book'],
      where: {
        book: {
          id: bookId,
        },
      },
    });
    // update the reviewCount
    const book = await this.booksRepository.findOne(bookId);
    book.reviewCount = await reviewCount;
    await this.booksRepository.save(book);
  }
}
