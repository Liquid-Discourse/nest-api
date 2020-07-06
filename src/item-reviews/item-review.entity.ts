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
import { ItemEntity } from '../items/item.entity';
import { TagEntity } from '../tags/tag.entity';

// I give it a manual name otherwise in postgres the table will be called
// item_review_entity, which is fine but meh
@Entity({ name: 'item_review' })
export class ItemReviewEntity {
  // item: the item this review was for
  @ManyToOne(
    type => ItemEntity,
    item => item.reviews,
  )
  item: ItemEntity;

  // userWhoReviewed: the user who gave the review
  @ManyToOne(
    type => UserEntity,
    // the back reference is with this property
    user => user.reviewedItems,
    // when the user is deleted, delete the review also
    { onDelete: 'CASCADE' },
  )
  userWhoReviewed: UserEntity;

  // isSeed: such reviews only exist as a mechanism to seed items in the
  // database
  @Column({ default: false })
  isSeed: boolean;

  // * REVIEW

  // suggestedName
  @Column({ nullable: true })
  suggestedName: string;

  // suggestedDescription
  @Column({ nullable: true })
  suggestedDescription: string;

  // suggestedRatingOutOfFive: the rating left for this item
  @Column({ default: 0 })
  suggestedRatingOutOfFive: number;

  // suggestedTags: the tags suggested in this review
  @ManyToMany(
    type => TagEntity,
    tag => tag.reviewsSuggestingThisTag,
  )
  @JoinTable()
  suggestedTags: TagEntity[];

  // * AUTOMATIC PROPERTIES

  @PrimaryGeneratedColumn()
  id: number;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
