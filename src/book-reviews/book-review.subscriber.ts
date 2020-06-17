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
    console.log('after insert');
    this.updateBook(event.entity.book.id);
    if (event.entity.suggestedTags) {
      this.updateTags(event.entity.suggestedTags.map(t => t.id));
    }
  }

  async afterRemove(event: RemoveEvent<BookReviewEntity>) {
    console.log('after remove');
    this.updateBook(event.entity.book.id);
    if (event.entity.suggestedTags) {
      this.updateTags(event.entity.suggestedTags.map(t => t.id));
    }
  }

  async afterUpdate(event: UpdateEvent<BookReviewEntity>) {
    console.log('after update');
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
    if (!tag) {
      return;
    }
    tag.bookCount = await tag.books.length;
    await this.tagsRepository.save(tag);
  }

  async updateBook(bookId: number) {
    console.log('update book');

    // get the book
    const book = await this.booksRepository.findOne({
      relations: ['tags'],
      where: {
        id: bookId,
      },
    });
    if (!book) {
      return;
    }

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

    // update the reviewCount
    book.reviewCount = reviewCount;

    // get all the tags for the book
    let collectTagIds: number[] = [];
    reviews.forEach(review => {
      collectTagIds = [
        ...collectTagIds,
        ...review.suggestedTags.map(tag => tag.id),
      ];
    });
    collectTagIds = Array.from(new Set(collectTagIds));
    console.log(collectTagIds);
    const finalTags: TagEntity[] = await Promise.all(
      collectTagIds.map(id => this.tagsRepository.findOne(id)),
    );
    book.tags = finalTags;

    // save the book
    this.booksRepository.save(book);
  }
}
