import { Injectable } from '@nestjs/common';
import type { PrismaService } from '../prisma/prisma.service';
import type { CreateUserInput } from './dto/create-user.input';
import type { User } from './entities/user.entity';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  // constructor(private prisma: PrismaService) {}
  constructor(private prisma: PrismaService) {}

  async create(createUserInput: CreateUserInput): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserInput.password, 10);
    console.log('hashedPassword', hashedPassword);
    const test = await this.prisma.user.findMany();
    console.log('ttt', test);

    return this.prisma.user.create({
      data: {
        ...createUserInput,
        password: hashedPassword,
      },
    });
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findOne(id: string): Promise<User> {
    return this.prisma.user.findUnique({ where: { id } });
  }
}
