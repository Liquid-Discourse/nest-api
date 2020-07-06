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
import { ItemEntity } from '../items/item.entity';
import { ItemReviewEntity } from '../item-reviews/item-review.entity';

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

  // reviewsSuggestingThisTag: item reviews that suggested this tag
  @ManyToMany(
    type => ItemReviewEntity,
    itemReview => itemReview.suggestedTags,
  )
  reviewsSuggestingThisTag: ItemReviewEntity[];

  // * AUTOMATIC PROPERTIES

  // items: all the items that belong to this tag
  // this is auto-updated using a subscriber
  @ManyToMany(
    type => ItemEntity,
    item => item.tags,
  )
  @JoinTable()
  items: ItemEntity[];

  // itemCount: how many items belong to this tag
  // this is auto-updated using a subscriber
  @Column({ default: 0 })
  itemCount: number;
}
