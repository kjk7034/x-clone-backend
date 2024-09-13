import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { AuthService } from './auth.service';
import { LoginInput, LoginResponse } from './dto/login.dto';
import { GqlAuthGuard } from './guards/gql-auth.guard';

@Resolver('Auth')
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => LoginResponse)
  async login(
    @Args('loginInput') loginInput: LoginInput,
    @Args('deviceId', { nullable: true }) deviceId?: string,
  ) {
    try {
      const result = await this.authService.login(loginInput.email, loginInput.password, deviceId);
      if (!result) {
        throw new Error('Invalid credentials');
      }
      return {
        access_token: result.access_token,
        sessionId: result.sessionId,
      };
    } catch (error) {
      throw new Error(error.message || 'An error occurred during login');
    }
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async logoutAllDevices(@CurrentUser() user: User) {
    return this.authService.logoutAllDevices(user.id);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async logout(@CurrentUser() user: User, @Context() context) {
    const sessionId = context.req.user.sessionId;
    return this.authService.logout(user.id, sessionId);
  }

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  async me(@CurrentUser() user: User) {
    return user;
  }
}
