import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserInput } from './dto/create-user.dto';
import { UpdateUserInput } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserInput: CreateUserInput) {
    // 먼저 이메일이 이미 존재하는지 확인
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserInput.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserInput.password, 10);

    try {
      return await this.prisma.user.create({
        data: {
          ...createUserInput,
          password: hashedPassword,
        },
      });
    } catch (error) {
      // Prisma의 고유 제약 조건 위반 오류를 잡습니다 (추가적인 안전장치)
      if (error.code === 'P2002') {
        throw new ConflictException('Email already exists');
      }
      throw error; // 다른 종류의 오류는 그대로 전파
    }
  }

  async update(id: string, updateUserInput: UpdateUserInput) {
    try {
      // 사용자가 존재하는지 먼저 확인
      const existingUser = await this.prisma.user.findUnique({
        where: { id },
      });
      if (!existingUser) {
        throw new NotFoundException('User not found');
      }

      // 이메일 변경 시 중복 확인
      if (updateUserInput.email) {
        if (updateUserInput.email === existingUser.email) {
          throw new ConflictException(
            'No changes were made to the email as the provided email is the same as the current one.',
          );
        }
        const emailExists = await this.prisma.user.findFirst({
          where: { email: updateUserInput.email },
        });
        if (emailExists) {
          throw new ConflictException('Email already exists');
        }
      }

      // 비밀번호 변경 시 해시화
      if (updateUserInput.password) {
        updateUserInput.password = await bcrypt.hash(updateUserInput.password, 10);
      }

      // 사용자 정보 업데이트
      return await this.prisma.user.update({
        where: { id },
        data: updateUserInput,
      });
    } catch (error) {
      if (error instanceof ConflictException || error instanceof NotFoundException) {
        throw error;
      }
      // Prisma의 고유 제약 조건 위반 오류 처리
      if (error.code === 'P2002') {
        throw new ConflictException('Email already exists');
      }
      // 기타 Prisma 오류 처리
      if (error.code === 'P2025') {
        throw new NotFoundException('User not found');
      }
      // 그 외의 오류는 그대로 전파
      throw error;
    }
  }

  async findByEmail(email: string) {
    return this.prisma.user.findFirst({ where: { email } });
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }
}
