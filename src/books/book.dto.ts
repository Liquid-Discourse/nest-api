// A DTO is a data transfer object (basically just the stuff submitted in the website form)

// we get validation for free!
export class CreateBookDTO {
  name: string;
  authors: string[];
  googleId: string;
}

enum QueryBookOrder {
  reviewCount = 'reviewCount',
  name = 'name',
  authors = 'authors',
}

enum QueryBookOrderDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class QueryBookDTO {
  order?: QueryBookOrder;
  orderDirection?: QueryBookOrderDirection;
  googleId?: string;
}
