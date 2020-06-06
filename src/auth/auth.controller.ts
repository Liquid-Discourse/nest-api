import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  @Get('test')
  @UseGuards(AuthGuard('jwt'))
  async auth(@Req() req) {
    console.log(req);
    return 'Hello world';
  }
}
