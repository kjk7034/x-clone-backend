import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ImagesResolver } from './images.resolver';
import { ImagesService } from './images.service';

@Module({
  providers: [ImagesResolver, ImagesService, PrismaService],
})
export class ImagesModule {}
