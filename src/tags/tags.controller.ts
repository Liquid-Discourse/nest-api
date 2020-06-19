import { Controller, Get, Param, Post, Body, Query } from '@nestjs/common';
import { TagEntity } from './tag.entity';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTagDTO, QueryTagDTO } from './tag.dto';

// Documentation
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import * as slugify from '@sindresorhus/slugify';

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
    if (query.slug) {
      options['where'] = {
        ...options['where'],
        slug: query.slug,
      };
    }
    // optional ordering options
    if (query.order) {
      options['order'] = {
        [query.order]: query.orderDirection ? query.orderDirection : 'DESC',
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

  // * CREATE TAGS

  @Post()
  @ApiOperation({
    summary: 'Create a new tag',
    description: 'Create a new tag',
  })
  async createTag(@Body() body: CreateTagDTO): Promise<TagEntity> {
    // create a slug from the tag name
    console.log(body);
    const slug = slugify(<string>body.name);
    // check if a tag with this type and slug already exists
    const existingTag = await this.tagsRepository.findOne({
      where: {
        type: body.type,
        slug: slug,
      },
    });
    // if tag already exists, return it
    if (existingTag) {
      return existingTag;
    }
    // else create a new tag with all DTO properties
    // as well as our generated slug
    const newTag = new TagEntity();
    Object.keys(body).forEach(key => {
      newTag[key] = body[key];
    });
    newTag.slug = slug;
    return this.tagsRepository.save(newTag);
  }
}
