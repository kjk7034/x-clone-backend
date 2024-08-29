import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import type { CreateUserInput } from './dto/create-user.input';
import { User } from './entities/user.entity';
import type { UsersService } from './users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput): Promise<User> {
    return this.usersService.create(createUserInput);
  }

  @Query(() => [User], { name: 'users' })
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Query(() => User, { name: 'user' })
  async findOne(@Args('id', { type: () => String }) id: string): Promise<User> {
    return this.usersService.findOne(id);
  }
}
