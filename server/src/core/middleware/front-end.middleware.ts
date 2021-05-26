import { NestMiddleware, Injectable } from '@nestjs/common';
import * as path from 'path';
import { Request, Response } from 'express';

const allowedExt = ['.js', '.ico', '.css', '.png', '.jpg', '.woff2', '.woff', '.ttf', '.svg'];

const resolvePath = (file: string) => path.resolve(`./public/${file}`);

@Injectable()
export class FrontendMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next) {
    const url = request.baseUrl;
    if (url.startsWith('/api/')) {
      next();
    } else if (allowedExt.filter((ext) => url.indexOf(ext) > 0).length > 0) {
      response.sendFile(resolvePath(url));
    } else {
      response.sendFile(resolvePath('index.html'));
    }
  }
}
