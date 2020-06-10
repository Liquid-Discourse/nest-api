// A DTO is a data transfer object (basically just the stuff submitted in the website form)

// we get validation for free!
export class CreateUserDTO {
  auth0Id: string;
  username: string;
  emailAddress: string;
  firstName?: string;
  restOfName?: string;
  picture?: string;
}
