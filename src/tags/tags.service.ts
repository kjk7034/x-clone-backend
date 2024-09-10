import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTagInput } from './dto/create-tag.dto';
import { UpdateTagInput } from './dto/update-tag.dto';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  create(createTagInput: CreateTagInput) {
    return this.prisma.tag.create({
      data: createTagInput,
    });
  }

  findAll() {
    return this.prisma.tag.findMany();
  }

  findOne(id: string) {
    return this.prisma.tag.findUnique({ where: { id } });
  }

  update(id: string, updateTagInput: UpdateTagInput) {
    return this.prisma.tag.update({
      where: { id },
      data: updateTagInput,
    });
  }

  remove(id: string) {
    return this.prisma.tag.delete({ where: { id } });
  }
}
