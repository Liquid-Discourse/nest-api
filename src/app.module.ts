import { Module } from '@nestjs/common';
import { AppController } from './app.controller';

// Custom modules
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { BooksModule } from './books/books.module';
import { BookReviewsModule } from './book-reviews/book-reviews.module';
import { TagsModule } from './tags/tags.module';

@Module({
  imports: [
    AuthModule,
    DatabaseModule,
    UsersModule,
    BooksModule,
    BookReviewsModule,
    TagsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
