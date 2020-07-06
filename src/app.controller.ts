import { Controller, Get } from '@nestjs/common';

@Controller('')
export class AppController {
  @Get()
  home(): string {
    return 'Welcome to the Proofed API. Head over to /docs to see documentation.';
  }
}
