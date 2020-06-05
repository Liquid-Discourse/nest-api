import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  // Visit website_domain/auth/google to trigger auth
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  // Google auth will redirect here
  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    if (!req.user) {
      return 'No user from Google';
    }
    return {
      message: 'User info from google',
      user: req.user,
    };
  }
}
