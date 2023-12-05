import { Controller, Get, Post } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() { }

  @Get()
  @Post()
  heathCheck(): string {
    return "ok";
  }
}
