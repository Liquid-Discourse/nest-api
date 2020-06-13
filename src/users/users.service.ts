// Injectable means that this service can be injected into other controllers and
// services
import { Injectable } from '@nestjs/common';

// InjectRepository is a way to inject typeorm entity as a repository variable
// with a connection to the database
import { InjectRepository } from '@nestjs/typeorm';

// Repository is just a TypeScript type
import { Repository } from 'typeorm';

// this is our user entity
import { UserEntity } from './user.entity';

// external services
import { AuthService } from '../auth/auth.service';
import { CreateUserDTO } from './user.dto';
import { BookEntity } from '../books/book.entity';

interface existsInDbArgs {
  auth0Id?: string;
  emailAddress?: string;
}

@Injectable()
export class UsersService {
  // this shorthand constructor creates class members for us and initializes
  // them in the same statement
  constructor(
    //  we inject the UserEntity as a repository.
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,

    //  we inject the UserEntity as a repository.
    @InjectRepository(BookEntity)
    private readonly booksRepository: Repository<BookEntity>,

    // we also inject external services
    private authService: AuthService,
  ) {}

  // existsInDB: does the user exist in the database?
  async existsInDB(args: existsInDbArgs) {
    let users = [];
    if (args.auth0Id) {
      users = await this.usersRepository.find({
        where: {
          auth0Id: args.auth0Id,
        },
      });
    } else if (args.emailAddress) {
      users = await this.usersRepository.find({
        where: {
          emailAddress: args.emailAddress,
        },
      });
    }
    return users.length === 1;
  }

  async createUserIfNotExist(request): Promise<UserEntity> {
    // fetch the Auth0 ID from the JWT token
    const auth0Id = request?.user?.sub;
    // if there is an ID
    if (auth0Id) {
      // check if user exists in DB which corresponds to this ID
      const existsInDb = await this.existsInDB({
        auth0Id: auth0Id,
      });
      // if a user does not exist
      if (await !existsInDb) {
        // fetch the Auth0 profile using the Management API
        const auth0Profile = await this.authService.getAuth0Profile(request);
        // prepare a payload to save in our database
        const user: CreateUserDTO = {
          auth0Id: auth0Id,
          username: auth0Id,
          emailAddress: await auth0Profile.email,
          firstName: await auth0Profile.given_name,
          restOfName: await auth0Profile.family_name,
          picture: await auth0Profile.picture,
        };
        // save this to the database
        return this.usersRepository.save(user);
      }
    }
  }

  async addToShelf(request, bookId: string): Promise<UserEntity> {
    // fetch the Auth0 ID from the JWT token
    const auth0Id = request?.user?.sub;
    if (!auth0Id) {
      return;
    }
    // fetch the user
    const user = await this.usersRepository.findOne({
      relations: ['bookShelf'],
      where: {
        auth0Id: auth0Id,
      },
    });
    if (await !user) {
      return;
    }
    // fetch the book
    const book = await this.booksRepository.findOne({
      where: {
        id: bookId,
      },
    });
    if (await !book) {
      return;
    }
    // store to shelf
    if (await !user.bookShelf.includes(book)) {
      await user.bookShelf.push(book);
    }
    return this.usersRepository.save(await user);
  }
}
