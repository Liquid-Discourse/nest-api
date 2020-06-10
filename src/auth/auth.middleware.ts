import { Injectable, NestMiddleware } from '@nestjs/common';
import * as jwt from 'express-jwt';
import { expressJwtSecret } from 'jwks-rsa';
import { Request, Response } from 'express';
import { UsersService } from '../users/users.service';
import { CreateUserDTO } from '../users/user.dto';
import { AuthService } from './auth.service';

// source:
// https://github.com/bipiane/nest-react-auth0-blog/blob/master/blog-api/src/common/authentication.middleware.ts
// this middleware verifies incoming JWT tokens against the Auth0 service. Only
// when the token is deemed valid does the endpoint become accessible
@Injectable()
export class JWTMiddleware implements NestMiddleware {
  // inject users service
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  // create user if not exist in db
  async createUserIfNotExist(request) {
    const auth0Id = request?.user?.sub;
    if (auth0Id) {
      const existsInDb = await this.usersService.existsInDB({
        auth0Id: auth0Id,
      });
      if (await !existsInDb) {
        const auth0Profile = await this.authService.getAuth0Profile(request);
        const user: CreateUserDTO = {
          auth0Id: auth0Id,
          emailAddress: await auth0Profile.email,
          firstName: await auth0Profile.given_name,
          restOfName: await auth0Profile.family_name,
        };
        await this.usersService.create(user);
      }
    }
  }

  // define use method for middleware
  use(req: Request, res: Response, next: Function) {
    jwt({
      secret: expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
      }),
      issuer: `https://${process.env.AUTH0_DOMAIN}/`,
      audience: process.env.AUTH0_AUDIENCE,
      algorithm: ['RS256'],
    })(req, res, err => {
      // if error, send back a message
      if (err) {
        const status = err.status || 500;
        const message =
          err.message || 'Sorry, but we cannot process your request';
        return res.status(status).send({
          message,
        });
      }

      // check if user exists. if not, create the user for first time
      this.createUserIfNotExist(req);

      next();
    });
  }
}
