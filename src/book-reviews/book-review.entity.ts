import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../users/user.entity';
import { BookEntity } from '../books/book.entity';
import { TagEntity } from '../tags/tag.entity';

// I give it a manual name otherwise in postgres the table will be called
// book_review_entity, which is fine but meh
@Entity({ name: 'book_review' })
export class BookReviewEntity {
  // id: auto generated id
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // isAdminReview: such reviews do not contribute to rating or text mining
  // operations. They only exist as a mechanism to seed books in the database
  @Column({ default: false })
  isAdminReview: boolean;

  // userWhoReviewed: the user who gave the review
  @ManyToOne(
    type => UserEntity,
    // the back reference is with this property
    userWhoReviewed => userWhoReviewed.bookReviews,
    // when the user is deleted, delete the review also
    { onDelete: 'CASCADE' },
  )
  userWhoReviewed: UserEntity;

  // isCompleted: whether or not the book review is completed
  // if isCompleted == false, then it's part of the unreviewed bookshelf
  // else it's part of the reviewed bookshelf
  @Column({ default: false })
  isCompleted: boolean;

  // book: the book this review was for
  @ManyToOne(
    type => BookEntity,
    // the back reference is with this property
    book => book.reviews,
  )
  book: BookEntity;

  // ratingOutOfFive: the rating left for this book
  @Column({ default: 0 })
  ratingOutOfFive: number;

  // description:
  @Column({ nullable: true })
  description: string;

  // suggestedTags: the tags suggested in this review
  @ManyToMany(
    type => TagEntity,
    tag => tag.reviewsSuggestingThisTag,
  )
  @JoinTable()
  suggestedTags: TagEntity[];
}
