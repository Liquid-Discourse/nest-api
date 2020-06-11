import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  AfterUpdate,
} from 'typeorm';
import { UserEntity } from '../users/user.entity';
import { BookEntity } from '../books/book.entity';

// I give it a manual name otherwise in postgres the table will be called
// book_review_entity, which is fine but meh
@Entity({ name: 'book_review' })
export class BookReviewEntity {
  // id: auto generated id
  @PrimaryGeneratedColumn()
  id: number;

  // userWhoReviewed: the user who gave the review
  @ManyToOne(
    type => UserEntity,
    // the back reference is with this property
    userWhoReviewed => userWhoReviewed.bookReviews,
  )
  userWhoReviewed: UserEntity;

  // book: the book this review was for
  @ManyToOne(
    type => BookEntity,
    // the back reference is with this property
    book => book.reviews,
  )
  book: BookEntity;

  // ratingOutOfTen: the rating left for this book
  @Column()
  ratingOutOfTen: number;

  @AfterUpdate()
  updateBookProperties() {
    console.log(this);
  }
}
