import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ItemReviewEntity } from '../item-reviews/item-review.entity';
import { ItemEntity } from '../items/item.entity';
import { ListEntity } from '../lists/list.entity';

// I give it a manual name otherwise in postgres the table will be called
// user_entity, which is fine but meh
@Entity({ name: 'user' })
export class UserEntity {
  // authOID: unique auth0 ID for the user
  @Column({ unique: true })
  auth0Id: string;

  // isAdmin: user permissions
  @Column({ default: false })
  isAdmin: boolean;

  // email: unique email address for the user
  @Column({ nullable: true })
  emailAddress: string;

  // username: auto generated but mutable username
  @Column({ unique: true })
  username: string;

  // picture: URL to user picture
  @Column({ nullable: true })
  picture: string;

  // firstName: first name of the user
  @Column({ nullable: true })
  firstName: string;

  // restOfName: middle and/or last name of the user
  @Column({ nullable: true })
  restOfName: string;

  // profileIsPublic: whether or not the user's profile should be publicly visible
  @Column({ default: true })
  profileIsPublic: boolean;

  // * AUTOMATIC PROPERTIES

  // id: auto generated id
  @PrimaryGeneratedColumn()
  id: number;

  // createdAt: when this entity was created
  @CreateDateColumn()
  createdAt: Date;

  // updatedAt: when this entity was updated
  @UpdateDateColumn()
  updatedAt: Date;

  // submittedItems: all the items submitted by this user
  @OneToMany(
    type => ItemEntity,
    item => item.userWhoSubmitted,
  )
  submittedItems: ItemEntity[];

  // reviewedItems: all the item reviews left by this user
  @OneToMany(
    type => ItemReviewEntity,
    itemReview => itemReview.userWhoReviewed,
  )
  reviewedItems: ItemReviewEntity[];

  // upvotedItems: all the items upvoted by this user
  @ManyToMany(
    type => ItemEntity,
    item => item.upvotingUsers,
  )
  @JoinTable()
  upvotedItems: ItemEntity[];

  // lists: lists that belong to this user
  @OneToMany(
    type => ListEntity,
    list => list.userWhoOwns,
  )
  lists: ListEntity[];
}
