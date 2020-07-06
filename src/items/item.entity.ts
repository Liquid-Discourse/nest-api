import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

import { ItemReviewEntity } from '../item-reviews/item-review.entity';
import { TagEntity } from '../tags/tag.entity';
import { UserEntity } from '../users/user.entity';

export enum ItemType {
  Book = 'BOOK',
  Link = 'LINK',
  Action = 'ACTION',
}

// I give it a manual name otherwise in postgres the table will be called
// item_entity, which is fine but meh
@Entity({ name: 'item' })
export class ItemEntity {
  // name: short name for the item
  @Column({ nullable: true })
  name: string;

  // type: What type of Item is it? Using this, we can accomodate a wide variety of usecases
  @Column({ default: ItemType.Link })
  type: ItemType;

  // description: description for the item
  @Column({ nullable: true })
  description: string;

  // authors: who wrote it
  @Column({ type: 'text', array: true, nullable: true })
  authors: string[];

  // googleId: unique identifier for this item.
  @Column()
  googleId: string;

  // * AUTOMATIC PROPERTIES AND RELATIONS

  // upvotingUsers: who upvoted this item
  @ManyToMany(
    type => UserEntity,
    item => item.upvotedItems,
  )
  upvotingUsers: UserEntity[];

  // upvoteCount: how many upvotes left for this item
  // this is auto-updated
  @Column({ default: 0 })
  upvoteCount: number;

  // reviewCount: how many reviews left for this item
  // this is auto-updated
  @Column({ default: 0 })
  reviewCount: number;

  // averageRatingOutOfFive: how many reviews left for this item
  // this is auto-updated
  @Column({ default: 0 })
  averageRatingOutOfFive: number;

  // userWhoSubmitted: the user who submitted this item
  @ManyToOne(
    type => UserEntity,
    user => user.submittedItems,
  )
  userWhoSubmitted: UserEntity;

  // tags: all the tags that belong to this item
  // this is auto-updated using a subscriber
  @ManyToMany(
    type => TagEntity,
    tag => tag.items,
  )
  tags: TagEntity[];

  // reviews: all the reviews left for this item
  @OneToMany(
    type => ItemReviewEntity,
    itemReview => itemReview.item,
  )
  reviews: ItemReviewEntity[];

  @PrimaryGeneratedColumn()
  id: number;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
