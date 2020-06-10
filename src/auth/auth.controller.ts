import { Controller, Get, Req } from '@nestjs/common';
import { getAuth0UserProfileFromRequest } from './auth.utilities';

@Controller('auth')
export class AuthController {
  @Get('test')
  async auth(@Req() req) {
    const profile = await getAuth0UserProfileFromRequest(req);
    return profile;
  }
}
