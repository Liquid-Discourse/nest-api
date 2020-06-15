// A DTO is a data transfer object (basically just the stuff submitted in the website form)

// we get validation for free!
export class CreateBookReviewDTO {
  bookId: number;
  ratingOutOfTen?: number;
  suggestedTags?: number[];
  isCompleted?: boolean;
}

export class QueryBookReviewDTO {
  bookId?: number;
}

export class DeleteBookReviewDTO {
  reviewId?: number;
}
