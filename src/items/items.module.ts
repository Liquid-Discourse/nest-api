import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemEntity } from './item.entity';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { ItemReviewsModule } from '../item-reviews/item-reviews.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ItemEntity]),
    forwardRef(() => ItemReviewsModule),
  ],
  controllers: [ItemsController],
  providers: [ItemsService],
  exports: [TypeOrmModule, ItemsService],
})
export class ItemsModule {}
