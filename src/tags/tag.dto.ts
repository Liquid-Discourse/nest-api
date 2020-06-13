// A DTO is a data transfer object (basically just the stuff submitted in the website form)

import { TagType } from './tag.entity';

// we get validation for free!
export class CreateTagDTO {
  name: string;
  description?: string;
  type?: TagType;
}

export class QueryTagDTO {
  type?: TagType;
}
