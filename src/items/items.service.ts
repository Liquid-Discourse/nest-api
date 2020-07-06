// Injectable means that this service can be injected into other controllers and
// services
import { Injectable } from '@nestjs/common';

// InjectRepository is a way to inject typeorm entity as a repository variable
// with a connection to the database
import { InjectRepository } from '@nestjs/typeorm';

// Repository is just a TypeScript type
import { Repository } from 'typeorm';

// import entities
import { ItemEntity } from './item.entity';

@Injectable()
export class ItemsService {
  // this shorthand constructor creates class members for us and initializes
  // them in the same statement
  constructor(
    //  we inject the ItemEntity as a repository
    @InjectRepository(ItemEntity)
    private readonly itemsRepository: Repository<ItemEntity>,
  ) {}
}
