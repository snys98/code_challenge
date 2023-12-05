import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  heathCheck(): string {
    return "ok";
  }
}
