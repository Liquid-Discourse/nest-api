// A DTO is a data transfer object (basically just the stuff submitted in the website form)

// we get validation for free!
export class CreateBookDTO {
  name: string;
  author: string;
  isbn: string;
}