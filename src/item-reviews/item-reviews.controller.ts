import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Query,
  Req,
  Delete,
} from '@nestjs/common';

import { ItemReviewEntity } from './item-review.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  CreateItemReviewDTO,
  QueryItemReviewDTO,
  DeleteItemReviewDTO,
} from './item-review.dto';

import { UserEntity } from '../users/user.entity';
import { ItemEntity } from '../items/item.entity';
import { TagEntity } from '../tags/tag.entity';

// Documentation
import { ApiOperation, ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('item-reviews')
@Controller('item-reviews')
export class ItemReviewsController {
  constructor(
    @InjectRepository(ItemReviewEntity)
    private readonly itemReviewsRepository: Repository<ItemReviewEntity>,

    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,

    @InjectRepository(ItemEntity)
    private readonly itemsRepository: Repository<ItemEntity>,

    @InjectRepository(TagEntity)
    private readonly tagsRepository: Repository<TagEntity>,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Query for item reviews',
    description:
      'Query for item reviews. Supply optional parameters (below) to filter your search',
  })
  getItemReviews(
    @Query() query: QueryItemReviewDTO,
  ): Promise<ItemReviewEntity[]> {
    const options = {
      relations: ['userWhoReviewed', 'item', 'suggestedTags'], // expand the relations in the result
    };
    if (query.itemId) {
      options['where'] = {
        ...options['where'],
        item: {
          id: query.itemId,
        },
      };
    }
    if (query.userId) {
      options['where'] = {
        ...options['where'],
        userWhoReviewed: {
          id: query.userId,
        },
      };
    }
    return this.itemReviewsRepository.find(options);
  }

  @Get(':itemReviewId')
  @ApiOperation({
    summary: 'Get a specific item review by its ID',
    description: 'Get a specific item review by its ID',
  })
  async getItemReview(@Param() params): Promise<ItemReviewEntity> {
    return this.itemReviewsRepository.findOne({
      relations: ['userWhoReviewed', 'item', 'suggestedTags'],
      where: {
        id: params.itemReviewId,
      },
    });
  }

  @Delete()
  @ApiOperation({
    summary: 'Delete a specific item review by its ID. Requires user token',
    description: 'Delete a specific item review by its ID. Requires user token',
  })
  @ApiBearerAuth()
  async deleteItemReview(
    @Req() req,
    @Body() body: DeleteItemReviewDTO,
  ): Promise<ItemReviewEntity> {
    // get user from JWT token
    const userWhoReviewed = await this.usersRepository.findOne({
      where: {
        auth0Id: req?.user?.sub,
      },
    });
    // get review
    const itemReviewId = body.itemReviewId;
    const itemReview = await this.itemReviewsRepository.findOne({
      relations: ['userWhoReviewed', 'item', 'suggestedTags'],
      where: {
        id: itemReviewId,
        userWhoReviewed: userWhoReviewed,
      },
    });
    // remove it
    await this.itemReviewsRepository.remove(itemReview);
    await this.onItemReviewChange(itemReview);
    return itemReview;
  }

  @Post()
  @ApiOperation({
    summary:
      'Create a new item review. Posting repeatedly with same itemId and token updates the review. Requires user token',
    description:
      'Create a new item review. Posting repeatedly with same itemId and token updates the review. Requires user token',
  })
  @ApiBearerAuth()
  async createItemReview(
    @Req() req,
    @Body() body: CreateItemReviewDTO,
  ): Promise<ItemReviewEntity> {
    // get user from JWT token
    const userCreatingTheReview = await this.usersRepository.findOne({
      where: {
        auth0Id: req?.user?.sub,
      },
    });
    // get item
    const itemBeingReviewed = await this.itemsRepository.findOne({
      where: {
        id: body.itemId,
      },
    });
    // check if review already exists
    let itemReview: ItemReviewEntity;
    itemReview = await this.itemReviewsRepository.findOne({
      relations: ['userWhoReviewed', 'item', 'suggestedTags'],
      where: {
        userWhoReviewed: userCreatingTheReview,
        item: itemBeingReviewed,
      },
    });
    // if not exists, create new review
    if (!itemReview) {
      itemReview = new ItemReviewEntity();
    }
    // update basic information
    itemReview.userWhoReviewed = userCreatingTheReview;
    itemReview.item = itemBeingReviewed;
    Object.keys(body).forEach(key => {
      itemReview[key] = body[key];
    });
    // update relational information
    if (body.suggestedTags) {
      itemReview.suggestedTags = [];
      const tagEntities = await Promise.all(
        body.suggestedTags.map(tagId => this.tagsRepository.findOne(tagId)),
      );
      itemReview.suggestedTags = tagEntities;
    }

    // save
    const response = await this.itemReviewsRepository.save(itemReview);

    // callback to allow for updates
    await this.onItemReviewChange(response);

    // return
    return response;
  }

  async onItemReviewChange(itemReview: ItemReviewEntity) {
    // update the item
    await this.updateItemHelper(itemReview.item.id);
    // update the tags
    if (itemReview.suggestedTags) {
      this.updateTagsHelper(itemReview.suggestedTags.map(t => t.id));
    }
  }

  async updateItemHelper(itemId: number) {
    // get the item
    const item = await this.itemsRepository.findOne({
      relations: ['tags'],
      where: {
        id: itemId,
      },
    });
    if (!item) {
      return;
    }

    // get all the user reviews for item (not including admin)
    const [
      userReviews,
      userReviewCount,
    ] = await this.itemReviewsRepository.findAndCount({
      relations: ['item', 'suggestedTags'],
      where: {
        item: {
          id: itemId,
        },
        isSeed: false,
      },
    });

    // get all the reviews for the item (including admin)
    const [
      allReviews,
      allReviewsCount,
    ] = await this.itemReviewsRepository.findAndCount({
      relations: ['item', 'suggestedTags'],
      where: {
        item: {
          id: itemId,
        },
      },
    });

    // update the reviewCount
    item.reviewCount = userReviewCount;

    // update the average rating
    let ratingTally = 0;
    userReviews.forEach(review => {
      ratingTally += review.suggestedRatingOutOfFive;
    });
    if (userReviewCount > 0) {
      item.averageRatingOutOfFive = ratingTally / userReviewCount;
    }

    // get all the tags for the item
    let collectTagIds: number[] = [];
    allReviews.forEach(review => {
      collectTagIds = [
        ...collectTagIds,
        ...review.suggestedTags.map(tag => tag.id),
      ];
    });
    collectTagIds = Array.from(new Set(collectTagIds));
    const finalTags: TagEntity[] = await Promise.all(
      collectTagIds.map(id => this.tagsRepository.findOne(id)),
    );
    item.tags = finalTags;

    // save the item
    await this.itemsRepository.save(item);
  }

  async updateTagsHelper(tagIds: number[]) {
    tagIds.forEach(tag => {
      this.updateTagHelper(tag);
    });
  }

  async updateTagHelper(tagId: number) {
    // we want to get the number of items for this tag
    const tag = await this.tagsRepository.findOne({
      relations: ['items'],
      where: {
        id: tagId,
      },
    });
    if (!tag) {
      return;
    }
    if (tag?.items?.length) {
      console.log('new length', tag.items.length);
      tag.itemCount = tag.items.length;
    }
    await this.tagsRepository.save(tag);
  }
}
