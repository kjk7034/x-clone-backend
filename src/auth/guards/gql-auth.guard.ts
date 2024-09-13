import { ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth.service';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(GqlAuthGuard.name);

  constructor(private authService: AuthService) {
    super();
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = this.getRequest(context);
    const token = this.extractTokenFromHeader(request);

    this.logger.debug(`Extracted token: ${token ? 'Present' : 'Not present'}`);

    if (!token) {
      this.logger.warn('No token provided');
      throw new UnauthorizedException('No token provided');
    }

    try {
      const payload = await this.authService.verifyToken(token);
      this.logger.debug(`Token verified, payload: ${JSON.stringify(payload)}`);

      const isValid = await this.authService.validateToken(payload.sub, payload.sessionId, token);
      this.logger.debug(`Token validation result: ${isValid}`);

      if (!isValid) {
        this.logger.warn(`Token not found in cache for user ${payload.sub}`);
        throw new UnauthorizedException('Invalid token');
      }

      const user = await this.authService.validateUser(payload);
      if (!user) {
        this.logger.warn(`User not found for payload ${JSON.stringify(payload)}`);
        throw new UnauthorizedException('User not found');
      }

      request.user = {
        ...user,
        sessionId: payload.sessionId,
        deviceId: payload.deviceId,
      };
      this.logger.debug(`User validated: ${JSON.stringify(request.user)}`);
      return true;
    } catch (error) {
      this.logger.error(`Error in canActivate: ${error.message}`);
      throw new UnauthorizedException('Invalid token');
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
