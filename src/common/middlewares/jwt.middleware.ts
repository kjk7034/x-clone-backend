import { Injectable, type NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // biome-ignore lint/complexity/useLiteralKeys: <explanation>
    const authHeader = req.headers['authorization'];
    if (authHeader) {
      const [bearer, token] = authHeader.split(' ');
      if (bearer === 'Bearer' && token) {
        try {
          const payload = this.jwtService.verify(token);
          const isValid = await this.authService.validateToken(payload.sub);
          if (isValid) {
            const user = await this.usersService.findOne(payload.sub);
            if (user) {
              // biome-ignore lint/complexity/useLiteralKeys: <explanation>
              req['user'] = user;
            }
          }
        } catch (error) {
          console.log('error', error);
          // 토큰이 유효하지 않거나 만료된 경우
          // 여기서 에러를 throw하지 않고, 다음 미들웨어로 넘깁니다.
          // GraphQL의 컨텍스트에서 인증 상태를 확인할 수 있습니다.
        }
      }
    }
    next();
  }
}
