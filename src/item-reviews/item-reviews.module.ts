import {
  Module,
  MiddlewareConsumer,
  RequestMethod,
  forwardRef,
} from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

// JWTMiddleware: protects endpoints with JWT auth
import { JWTMiddleware } from '../auth/auth.middleware';

import { ItemReviewEntity } from './item-review.entity';

// import controllers
import { ItemReviewsController } from './item-reviews.controller';

// import services
import { ItemsService } from '../items/items.service';

// import other modules
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { ItemsModule } from '../items/items.module';
import { TagsModule } from '../tags/tags.module';

@Module({
  imports: [
    // add our ItemReviewEntity to TypeORM so it can recognize it
    TypeOrmModule.forFeature([ItemReviewEntity]),

    // we need functionality from these modules so we import them
    forwardRef(() => AuthModule),
    forwardRef(() => UsersModule),
    forwardRef(() => ItemsModule),
    forwardRef(() => TagsModule),
  ],

  // all the endpoints/routes
  controllers: [ItemReviewsController],

  // all the logic
  providers: [ItemsService],

  // we re-export TypeORM so the repositories can be used elsewhere
  exports: [TypeOrmModule],
})
export class ItemReviewsModule {
  // protect certain routes with JWT auth
  // i.e. we only want logged in users to be able to create reviews
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JWTMiddleware).forRoutes(
      {
        path: 'item-reviews', // the path to the route we want to protect
        method: RequestMethod.POST, // the method e.g. GET, POST or ALL
      },
      {
        path: 'item-reviews', // the path to the route we want to protect
        method: RequestMethod.DELETE, // the method e.g. GET, POST or ALL
      },
    );
  }
}
