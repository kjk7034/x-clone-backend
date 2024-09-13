import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Cache } from 'cache-manager';
import { UsersService } from 'src/users/users.service';
import { LoginResponse } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async login(email: string, password: string): Promise<LoginResponse> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);
    await this.cacheManager.set(`auth_${user.id}`, token, 3600000); // 1시간 동안 저장
    return {
      access_token: token,
    };
  }

  async logout(userId: string): Promise<boolean> {
    await this.cacheManager.del(`auth_${userId}`);
    return true;
  }

  async validateToken(userId: string): Promise<boolean> {
    const cachedToken = await this.cacheManager.get(`auth_${userId}`);
    return !!cachedToken;
  }

  async validateUser(payload: any): Promise<any> {
    const user = await this.usersService.findOne(payload.sub);
    if (!user) {
      return null;
    }
    return user;
  }

  async verifyToken(token: string): Promise<any> {
    try {
      const payload = this.jwtService.verify(token);
      const isValid = await this.validateToken(payload.sub);
      if (!isValid) {
        throw new UnauthorizedException('Token not found in cache');
      }
      return payload;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      if (error.name === 'TokenExpiredError') {
        this.logger.warn(`Token expired: ${error.message}`);
        throw new UnauthorizedException('Token has expired');
      }
      if (error.name === 'JsonWebTokenError') {
        this.logger.warn(`Invalid token: ${error.message}`);
        throw new UnauthorizedException('Invalid token');
      }
      this.logger.error(`Unexpected error during token verification: ${error.message}`);
      throw new UnauthorizedException('Authentication failed');
    }
  }

  async refreshToken(userId: string): Promise<string | null> {
    const cachedToken = await this.cacheManager.get<string>(`auth_${userId}`);
    if (cachedToken) {
      // 토큰 유효 기간 연장
      await this.cacheManager.set(`auth_${userId}`, cachedToken, 3600000);
      return cachedToken;
    }
    return null;
  }

  async blacklistToken(token: string): Promise<void> {
    const payload = this.jwtService.decode(token) as {
      exp: number;
      sub: string;
    };
    const ttl = payload.exp - Math.floor(Date.now() / 1000);
    await this.cacheManager.set(`blacklist_${token}`, true, ttl * 1000);
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    return !!(await this.cacheManager.get(`blacklist_${token}`));
  }
}
