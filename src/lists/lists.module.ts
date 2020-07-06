import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListEntity } from './list.entity';
// import { ListsController } from './lists.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ListEntity])],
  exports: [TypeOrmModule],
  // controllers: [ListsController],
})
export class ListsModule {}
