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

  async create(userDTO: CreateUserDTO) {
    return this.usersRepository.save(userDTO);
  }
}
