import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';

import { BookReviewEntity } from '../book-reviews/book-review.entity';
import { TagEntity } from '../tags/tag.entity';

// I give it a manual name otherwise in postgres the table will be called
// book_entity, which is fine but meh
@Entity({ name: 'book' })
export class BookEntity {
  // id: auto generated id
  @PrimaryGeneratedColumn()
  id: number;

  // name: short name for the books
  @Column()
  name: string;

  // isbn: unique ISBN identifier for this book.
  // TODO: should we enforce uniqueness?
  @Column()
  isbn: string;

  // reviews: all the reviews left for this book
  @OneToMany(
    type => BookReviewEntity,
    bookReview => bookReview.book,
  )
  reviews: BookReviewEntity[];

  // tags: all the tags that belong to this book
  @ManyToMany(
    type => TagEntity,
    tag => tag.books,
  )
  tags: TagEntity[];
}
