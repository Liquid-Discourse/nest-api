// A DTO is a data transfer object (basically just the stuff submitted in the website form)

// we get validation for free!
export class CreateBookReviewDTO {
  bookId: number;
  ratingOutOfFive?: number;
  suggestedTags?: number[];
  isCompleted?: boolean;
  description?: string;
}

export class QueryBookReviewDTO {
  bookId?: number;
  userId?: number;
}

export class DeleteBookReviewDTO {
  reviewId?: number;
}
