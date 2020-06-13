import { Controller, Get, Param, Post, Body, Query } from '@nestjs/common';
import { TagEntity } from './tag.entity';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTagDTO, QueryTagDTO } from './tag.dto';

// Documentation
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('tags')
@Controller('tags')
export class TagsController {
  constructor(
    @InjectRepository(TagEntity)
    private readonly tagsRepository: Repository<TagEntity>,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Query for tags',
    description:
      'Query for tags. Supply optional parameters (below) to filter your search',
  })
  getTags(@Query() query: QueryTagDTO): Promise<TagEntity[]> {
    const options = {
      relations: [
        'usersWhoListedAsPreferredTopic',
        'reviewsSuggestingThisTag',
        'books',
      ], // expand the relations in the result
    };
    if (query.type) {
      options['where'] = {
        type: query.type,
      };
    }
    return this.tagsRepository.find(options);
  }

  @Get(':tagId')
  @ApiOperation({
    summary: 'Get a specific tag by its ID',
    description: 'Get a specific tag by its ID',
  })
  getTag(@Param() params): Promise<TagEntity> {
    return this.tagsRepository.findOne({
      relations: [
        'usersWhoListedAsPreferredTopic',
        'reviewsSuggestingThisTag',
        'books',
      ], // expand the relations in the result
      where: {
        id: params.tagId,
      },
    });
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new tag',
    description: 'Create a new tag',
  })
  createTag(@Body() body: CreateTagDTO): Promise<TagEntity> {
    return this.tagsRepository.save(body);
  }
}
