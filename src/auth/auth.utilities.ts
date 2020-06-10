import { ManagementClient } from 'auth0';

export const getAuth0UserProfileFromRequest = async (req: any) => {
  const auth0Manager = new ManagementClient({
    domain: process.env.AUTH0_DOMAIN,
    clientId: process.env.AUTH0_MANAGEMENT_CLIENT_ID,
    clientSecret: process.env.AUTH0_MANAGEMENT_CLIENT_SECRET,
  });
  if (req?.user?.sub) {
    return auth0Manager.getUser({ id: req.user.sub });
  }
  return {};
};
