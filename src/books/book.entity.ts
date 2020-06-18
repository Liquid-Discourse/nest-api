import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { BookReviewEntity } from '../book-reviews/book-review.entity';
import { TagEntity } from '../tags/tag.entity';
import { UserEntity } from '../users/user.entity';

// I give it a manual name otherwise in postgres the table will be called
// book_entity, which is fine but meh
@Entity({ name: 'book' })
export class BookEntity {
  // id: auto generated id
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // name: short name for the books
  @Column()
  name: string;

  // authors: who wrote it
  @Column({ type: 'text', array: true, nullable: true })
  authors: string[];

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

  // * AUTOMATIC PROPERTIES

  // reviewCount: how many reviews left for this book
  // this is auto-updated using a subscriber
  @Column({ default: 0 })
  reviewCount: number;

  // averageRatingOutOfTen: the average rating for this book
  // this is auto-updated using a subscriber
  @Column({ default: 0 })
  averageRatingOutOfTen: number;

  // tags: all the tags that belong to this book
  // this is auto-updated using a subscriber
  @ManyToMany(
    type => TagEntity,
    tag => tag.books,
  )
  tags: TagEntity[];
}
