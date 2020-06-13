import { Controller, Get } from '@nestjs/common';

@Controller('')
export class AppController {
  @Get()
  home(): string {
    return 'Welcome to the Liquid Discourse API. Head over to /docs to see documentation.';
  }
}
