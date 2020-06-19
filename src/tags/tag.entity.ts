import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

import { UserEntity } from '../users/user.entity';
import { BookEntity } from '../books/book.entity';
import { BookReviewEntity } from '../book-reviews/book-review.entity';

export enum TagType {
  Affair = 'AFFAIR', // #BLM, Israel-Palestine, COVID-19 etc.
  Topic = 'TOPIC', //  police brutality, global conflict, foreign policy etc.
  Genre = 'GENRE', // fiction, non-fiction etc.
  Country = 'COUNTRY', // USA, UK, China etc.
}

// I give it a manual name otherwise in postgres the table will be called
// tag_entity, which is fine but meh
@Entity({ name: 'tag' })
export class TagEntity {
  // id: auto generated ID
  @PrimaryGeneratedColumn()
  id: number;

  // slug: a unique-ish URL slug for the tag
  // uniqueness is not enforced on the db side but the server side
  // when a tag is created via Post, a unique slug is created
  @Column()
  slug: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // name: a short tag name
  @Column()
  name: string;

  // description: long form description of the tag
  @Column({ nullable: true })
  description: string;

  // type: What type of Tag is it? Using this, we can accomodate a wide variety of usecases
  @Column({ default: TagType.Topic })
  type: TagType;

  // usersWhoListedAsPreferredTopic: users will be able to choose 3 preferred topics they
  // consider themselves experts in. Their credibility score will apply to these
  // topics only
  @ManyToMany(
    type => UserEntity,
    user => user.preferredTopics,
  )
  usersWhoListedAsPreferredTopic: UserEntity[];

  // reviewsSuggestingThisTag: book reviews that suggested this tag
  @ManyToMany(
    type => BookReviewEntity,
    bookReview => bookReview.suggestedTags,
  )
  reviewsSuggestingThisTag: BookReviewEntity[];

  // * AUTOMATIC PROPERTIES

  // books: all the books that belong to this tag
  // this is auto-updated using a subscriber
  @ManyToMany(
    type => BookEntity,
    book => book.tags,
  )
  @JoinTable()
  books: BookEntity[];

  // bookCount: how many books belong to this tag
  // this is auto-updated using a subscriber
  @Column({ default: 0 })
  bookCount: number;
}
