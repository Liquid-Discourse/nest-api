import { Injectable, NestMiddleware } from '@nestjs/common';
import * as jwt from 'express-jwt';
import { expressJwtSecret } from 'jwks-rsa';
import { Request, Response } from 'express';

// source:
// https://github.com/bipiane/nest-react-auth0-blog/blob/master/blog-api/src/common/authentication.middleware.ts
// this middleware verifies incoming JWT tokens against the Auth0 service. Only
// when the token is deemed valid does the endpoint become accessible
@Injectable()
export class JWTMiddleware implements NestMiddleware {
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
      if (err) {
        const status = err.status || 500;
        const message =
          err.message || 'Sorry, but we cannot process your request';
        return res.status(status).send({
          message,
        });
      }
      next();
    });
  }
}
