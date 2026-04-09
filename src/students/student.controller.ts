import { Controller, Get } from '@nestjs/common';

@Controller()
export class StudentController {
  @Get('/api/products')
  public getAllProducts() {
    return [
      { id: 1, title: 'hello' },
      { id: 2, title: 'hello' },
    ];
  }
}
