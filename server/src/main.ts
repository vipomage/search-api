require('dotenv').config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';
import { Logger } from '@nestjs/common';

async function bootstrap(): Promise<void> {
  const PORT: number = Number(process.env.PORT) || 3000;
  const logger: Logger = new Logger('BOOTSTRAP');

  const appInstance: INestApplication = await NestFactory.create(AppModule);
  appInstance.enableCors();

  await appInstance.listen(PORT).then(() => {
    logger.log(`Application is running on http://localhost:${PORT}`);
  });
}

bootstrap();
