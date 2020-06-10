// Injectable means that this service can be injected into other controllers and
// services
import { Injectable } from '@nestjs/common';

// ManagementClient is an Auth0 User Management API to manage user info
import { ManagementClient } from 'auth0';

@Injectable()
export class AuthService {
  // getAuth0Profile: retrieve the full profile from Auth0
  async getAuth0Profile(request: any) {
    const auth0Manager = new ManagementClient({
      domain: process.env.AUTH0_DOMAIN,
      clientId: process.env.AUTH0_MANAGEMENT_CLIENT_ID,
      clientSecret: process.env.AUTH0_MANAGEMENT_CLIENT_SECRET,
    });
    if (request?.user?.sub) {
      return auth0Manager.getUser({ id: request.user.sub });
    }
    return {};
  }
}
