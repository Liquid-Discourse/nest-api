import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// I give it a manual name otherwise in postgres the table will be called
// user_entity, which is fine but meh
@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column({ nullable: true })
  twitterUsername: string;

  @Column({ nullable: true })
  followerCount: number;
}
