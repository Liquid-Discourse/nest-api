// A DTO is a data transfer object (basically just the stuff submitted in the website form)

// we get validation for free!
export class CreateItemDTO {
  name?: string;
  authors?: string[];
  googleId?: string;
  description?: string;
}

enum QueryItemOrder {
  reviewCount = 'reviewCount',
  name = 'name',
  authors = 'authors',
}

enum QueryItemOrderDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class QueryItemDTO {
  order?: QueryItemOrder;
  orderDirection?: QueryItemOrderDirection;
  googleId?: string;
}
