import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import { UserEntity } from '../users/user.entity';
import { BookEntity } from '../books/book.entity';

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

  // name: a short tag name
  @Column()
  name: string;

  // description: long form description of the tag
  @Column()
  description: string;

  // type: What type of Tag is it? Using this, we can accomodate a wide variety of usecases
  @Column()
  type: TagType;

  // usersWhoListedAsPreferredTopic: users will be able to choose 3 preferred topics they
  // consider themselves experts in. Their credibility score will apply to these
  // topics only
  @ManyToMany(
    type => UserEntity,
    user => user.preferredTopics,
  )
  usersWhoListedAsPreferredTopic: UserEntity[];

  // books: all the books that belong to this tag
  @ManyToMany(
    type => BookEntity,
    book => book.tags,
  )
  @JoinTable()
  books: BookEntity[];
}