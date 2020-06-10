import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { BookReviewEntity } from '../book-reviews/book-review.entity';
import { TagEntity } from '../tags/tag.entity';

// I give it a manual name otherwise in postgres the table will be called
// user_entity, which is fine but meh
@Entity({ name: 'user' })
export class UserEntity {
  // id: auto generated id
  @PrimaryGeneratedColumn()
  id: number;

  // email: unique email address for the user
  @Column({ unique: true })
  emailAddress: string;

  // authOID: unique auth0 ID for the user
  @Column({ unique: true })
  auth0Id: string;

  // firstName: first name of the user
  @Column({ nullable: true })
  firstName: string;

  // restOfName: middle and/or last name of the user
  @Column({ nullable: true })
  restOfName: string;

  // twitterUsername: the connected twitter account username
  @Column({ nullable: true })
  twitterUsername: string;

  // twitterFollowerCount: the connected twitter account follower count
  @Column({ nullable: true })
  twitterFollowerCount: number;

  // profileIsPublic: whether or not the user's profile should be publicly visible
  @Column({ default: true })
  profileIsPublic: boolean;

  // bookReviews: all the reviews left by this user
  @OneToMany(
    type => BookReviewEntity,
    bookReview => bookReview.userWhoReviewed,
  )
  bookReviews: BookReviewEntity[];

  // preferredTopics: users will be able to choose 3 preferred topics they
  // consider themselves experts in. Their credibility score will apply to these
  // topics only
  @ManyToMany(
    type => TagEntity,
    tag => tag.usersWhoListedAsPreferredTopic,
  )
  @JoinTable()
  preferredTopics: TagEntity[];
}
