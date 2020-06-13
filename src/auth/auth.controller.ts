import { Controller, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  // in the constructor, we inject the AuthService as a variable. This
  // shorthand constructor is creating a class member for us and initializing it
  // in the same statement
  constructor(private authService: AuthService) {}

  @Get('test')
  @ApiOperation({
    summary: 'Get Auth0 profile. Requires user token',
    description: 'Get Auth0 profile. Requires user token',
  })
  @ApiBearerAuth()
  async auth(@Req() req) {
    const profile = await this.authService.getAuth0Profile(req);
    return profile;
  }
}
