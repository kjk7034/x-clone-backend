import { Injectable, type NestMiddleware, UnauthorizedException } from '@nestjs/common';
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
          const payload = await this.authService.verifyToken(token);
          if (payload) {
            // Attach the user and session information to the request
            (req as any).user = {
              id: payload.sub,
              email: payload.email,
              sessionId: payload.sessionId,
              deviceId: payload.deviceId,
            };
          }
        } catch (error) {
          if (error instanceof UnauthorizedException) {
            // Don't throw here, just log and continue
            console.log('JWT validation failed:', error.message);
          } else {
            console.error('Unexpected error in JWT middleware:', error);
          }
        }
      }
    }
    next();
  }
}
