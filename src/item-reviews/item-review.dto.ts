// A DTO is a data transfer object (basically just the stuff submitted in the website form)

// we get validation for free!
export class CreateItemReviewDTO {
  itemId: number;
  suggestedTags?: number[];
  suggestedName?: string;
  suggestedDescription?: string;
  suggestedRatingOutOfFive?: number;
}

export class QueryItemReviewDTO {
  itemId?: number;
  userId?: number;
}

export class DeleteItemReviewDTO {
  itemReviewId?: number;
}
