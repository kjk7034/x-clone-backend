import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TagsResolver } from './tags.resolver';
import { TagsService } from './tags.service';

@Module({
  providers: [TagsResolver, TagsService, PrismaService],
})
export class TagsModule {}
