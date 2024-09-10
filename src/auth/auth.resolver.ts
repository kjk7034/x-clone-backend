import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { LoginResponse } from './dto/login.dto';
import { LoginInput } from './dto/login.dto';

@Resolver('Auth')
export class AuthResolver {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Mutation(() => LoginResponse)
  async login(@Args('loginInput') loginInput: LoginInput, @Context() context) {
    try {
      const result = await this.authService.login(loginInput.email, loginInput.password);
      if (!result) {
        throw new Error('Invalid credentials');
      }
      const { access_token } = result;
      context.res.setHeader('Authorization', `Bearer ${access_token}`);

      return { access_token };
    } catch (error) {
      throw new Error(error.message || 'An error occurred during login');
    }
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async logout() {
    // 서버에서는 특별한 처리가 필요 없음
    return true;
  }

  @Query(() => User, { name: 'me' })
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: User) {
    return user;
  }
}
