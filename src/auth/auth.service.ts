import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Cache } from 'cache-manager';
import Redis from 'ioredis';
import { UsersService } from 'src/users/users.service';
import { v4 as uuidv4 } from 'uuid';
import { LoginResponse } from './dto/login.dto';

const TOKEN_EXPIRATION = Number.parseInt(process.env.TOKEN_EXPIRATION || '3600000', 10);

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private redisClient: Redis;

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    this.redisClient = (this.cacheManager as any).store.getClient();
  }

  async login(email: string, password: string, deviceId?: string): Promise<LoginResponse> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const sessionId = uuidv4();
    const payload = {
      email: user.email,
      sub: user.id,
      sessionId,
      deviceId: deviceId || `default_${uuidv4()}`,
    };
    const token = this.jwtService.sign(payload);

    await this.cacheManager.set(`auth_${user.id}_${sessionId}`, token, TOKEN_EXPIRATION);

    this.logger.log(`User logged in: ${user.id}, Device: ${deviceId}`);

    return {
      access_token: token,
      sessionId,
    };
  }

  async logout(userId: string, sessionId: string): Promise<boolean> {
    await this.cacheManager.del(`auth_${userId}_${sessionId}`);
    this.logger.log(`User logged out: ${userId}, Session: ${sessionId}`);
    return true;
  }

  async logoutAllDevices(userId: string): Promise<boolean> {
    const keys = await this.redisClient.keys(`auth_${userId}_*`);
    for (const key of keys) {
      await this.cacheManager.del(key);
    }
    this.logger.log(`User logged out from all devices: ${userId}`);
    return true;
  }

  async validateToken(userId: string, sessionId: string, token: string): Promise<boolean> {
    const storedToken = await this.cacheManager.get(`auth_${userId}_${sessionId}`);
    return storedToken === token;
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
      const isValid = await this.validateToken(payload.sub, payload.sessionId, token);
      if (!isValid) {
        throw new UnauthorizedException('Token not found in cache');
      }
      if (await this.isTokenBlacklisted(token)) {
        throw new UnauthorizedException('Token is blacklisted');
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

  async refreshToken(userId: string, sessionId: string): Promise<string | null> {
    const cachedToken = await this.cacheManager.get<string>(`auth_${userId}_${sessionId}`);
    if (cachedToken) {
      // 토큰 유효 기간 연장
      await this.cacheManager.set(`auth_${userId}_${sessionId}`, cachedToken, TOKEN_EXPIRATION);
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
