import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { ItemEntity } from './item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateItemDTO, QueryItemDTO } from './item.dto';

// Documentation
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('items')
@Controller('items')
export class ItemsController {
  constructor(
    @InjectRepository(ItemEntity)
    private readonly itemsRepository: Repository<ItemEntity>,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Query for items',
    description:
      'Query for items. Supply optional parameters (below) to filter your search',
  })
  getItems(@Query() query: QueryItemDTO): Promise<any> {
    // init options
    const options = {
      relations: ['tags', 'reviews'],
    };
    // optional ordering options
    if (query.order) {
      options['order'] = {
        [query.order]: query.orderDirection ? query.orderDirection : 'DESC',
      };
    }
    if (query.googleId) {
      options['where'] = {
        googleId: query.googleId,
      };
    }
    return this.itemsRepository.find(options);
  }

  @Get(':itemId')
  @ApiOperation({
    summary: 'Get a specific item review by its ID',
    description: 'Get a specific item review by its ID',
  })
  async getItem(@Param() params): Promise<any> {
    return this.itemsRepository.findOne({
      relations: ['tags', 'reviews', 'reviews.userWhoReviewed'],
      where: {
        id: params.itemId,
      },
    });
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new item',
    description: 'Create a new item',
  })
  createItem(@Body() body: CreateItemDTO): Promise<ItemEntity> {
    return this.itemsRepository.save(body);
  }
}
