import { Controller, Get, Post } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() { }

  @Get()
  @Post()
  hello(): string {
    return "ok";
  }
}
