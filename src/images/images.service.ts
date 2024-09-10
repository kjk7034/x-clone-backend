import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateImageInput } from './dto/create-image.dto';

@Injectable()
export class ImagesService {
  constructor(private prisma: PrismaService) {}

  create(createImageInput: CreateImageInput) {
    return this.prisma.image.create({
      data: createImageInput,
    });
  }

  findAll() {
    return this.prisma.image.findMany();
  }

  findOne(id: string) {
    return this.prisma.image.findUnique({ where: { id } });
  }

  remove(id: string) {
    return this.prisma.image.delete({ where: { id } });
  }
}
