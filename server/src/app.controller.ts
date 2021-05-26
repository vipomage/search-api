import { Controller, Get, Logger } from '@nestjs/common';

@Controller()
export class AppController {
  logger: Logger = new Logger(this.constructor.name);

  @Get('status')
  status(): string {
    return 'OK';
  }
}
