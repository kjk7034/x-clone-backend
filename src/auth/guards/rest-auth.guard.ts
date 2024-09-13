import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthService } from '../jwt.service';

@Injectable()
export class RestAuthGuard extends AuthGuard('jwt') {
  constructor(private jwtAuthService: JwtAuthService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    const user = await this.jwtAuthService.validateToken(token);
    if (!user) {
      throw new UnauthorizedException();
    }

    // biome-ignore lint/complexity/useLiteralKeys: <explanation>
    request['user'] = user;
    return true;
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
