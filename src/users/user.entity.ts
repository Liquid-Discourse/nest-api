import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  //   @Column()
  //   email: string;

  @Column()
  firstName: string;

  //   @Column()
  //   restOfName: string;

  //   @Column()
  //   twitterUsername: string;
}
