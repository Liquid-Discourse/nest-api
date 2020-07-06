import { Module } from '@nestjs/common';
import { AppController } from './app.controller';

// Custom modules
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { ItemsModule } from './items/items.module';
import { ItemReviewsModule } from './item-reviews/item-reviews.module';
import { TagsModule } from './tags/tags.module';

@Module({
  imports: [
    AuthModule,
    DatabaseModule,
    UsersModule,
    ItemsModule,
    ItemReviewsModule,
    TagsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
