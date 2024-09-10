import { Injectable, type NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['x-jwt'] as string;
    if (token) {
      try {
        const decoded = this.jwtService.verify(token);
        const user = await this.usersService.findOne(decoded.sub);
        // biome-ignore lint/complexity/useLiteralKeys: <explanation>
        req['user'] = user;
      } catch (e) {
        // 토큰이 유효하지 않은 경우
        console.error('Invalid token:', e);
      }
    }
    next();
  }
}
