import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from './shared/user/user.module';
import { ConfigModule } from './shared/config/config.module';
import { FrontendMiddleware } from './core/middleware/front-end.middleware';

@Module({
  imports: [ConfigModule, UserModule],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void | MiddlewareConsumer {
    consumer.apply(FrontendMiddleware).forRoutes({
      path: '/**', // For all routes
      method: RequestMethod.ALL, // For all methods
    });
  }
}
