import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  ManyToOne,
  JoinTable,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

import { UserEntity } from '../users/user.entity';
import { ItemEntity } from '../items/item.entity';

// I give it a manual name otherwise in postgres the table will be called
// list_entity, which is fine but meh
@Entity({ name: 'list' })
export class ListEntity {
  // name: a short list name
  @Column({ nullable: true })
  name: string;

  // description: long form description of the list
  @Column({ nullable: true })
  description: string;

  // userWhoOwns: the user that owns this list
  @ManyToOne(
    type => UserEntity,
    user => user.lists,
  )
  userWhoOwns: UserEntity;

  // items: all the items that belong to this list
  @ManyToMany(
    type => ItemEntity,
    item => item.lists,
  )
  @JoinTable()
  items: ItemEntity[];

  @PrimaryGeneratedColumn()
  id: number;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
