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
import { TagEntity } from '../tags/tag.entity';

@EventSubscriber()
export class BookReviewSubscriber
  implements EntitySubscriberInterface<BookReviewEntity> {
  constructor(
    connection: Connection,

    @InjectRepository(BookEntity)
    private readonly booksRepository: Repository<BookEntity>,

    @InjectRepository(BookReviewEntity)
    private readonly bookReviewsRepository: Repository<BookReviewEntity>,

    @InjectRepository(TagEntity)
    private readonly tagsRepository: Repository<TagEntity>,
  ) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return BookReviewEntity;
  }

  async afterInsert(event: InsertEvent<BookReviewEntity>) {
    this.updateBook(event.entity.book.id);
    if (event.entity.suggestedTags) {
      this.updateTags(event.entity.suggestedTags.map(t => t.id));
    }
  }

  async afterRemove(event: RemoveEvent<BookReviewEntity>) {
    this.updateBook(event.entity.book.id);
    if (event.entity.suggestedTags) {
      this.updateTags(event.entity.suggestedTags.map(t => t.id));
    }
  }

  async afterUpdate(event: UpdateEvent<BookReviewEntity>) {
    this.updateBook(event.entity.book.id);
    if (event.entity.suggestedTags) {
      this.updateTags(event.entity.suggestedTags.map(t => t.id));
    }
  }

  async updateTags(tagIds: number[]) {
    tagIds.forEach(tag => {
      this.updateTag(tag);
    });
  }

  async updateTag(tagId: number) {
    // we want to get the number of books for this tag
    const tag = await this.tagsRepository.findOne({
      relations: ['books'],
      where: {
        id: tagId,
      },
    });
    if (await !tag) {
      return;
    }
    tag.bookCount = await tag.books.length;
    await this.tagsRepository.save(tag);
  }

  async updateBook(bookId: number) {
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
    if (await !reviews) {
      return;
    }
    // get the book
    const book = await this.booksRepository.findOne(bookId);
    // update the reviewCount
    book.reviewCount = await reviewCount;
    // update the tags for the book based on all suggested tags
    // use a set to remove duplicates
    let collectTags: TagEntity[] = [];
    await reviews.forEach(async review => {
      collectTags = await collectTags.concat(review.suggestedTags);
    });
    collectTags = await Array.from(new Set(collectTags));
    book.tags = await collectTags;
    // save the book
    await this.booksRepository.save(book);
  }
}
