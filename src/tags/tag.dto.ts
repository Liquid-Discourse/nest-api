// A DTO is a data transfer object (basically just the stuff submitted in the website form)

import { TagType } from './tag.entity';

// we get validation for free!
export class CreateTagDTO {
  name: string;
  type: TagType;
  description?: string;
}

enum QueryTagOrder {
  bookCount = 'bookCount',
}

enum QueryTagOrderDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class QueryTagDTO {
  type?: TagType;
  order?: QueryTagOrder;
  orderDirection?: QueryTagOrderDirection;
}
