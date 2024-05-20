import { Controller, Delete, Get, Post } from '@nestjs/common';
import type { PrismaService } from 'src/services/prisma/prisma.service';
import { generateApiKey } from 'src/supports/str.support';
import type { CreateUser } from './user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('')
  async findAll() {
    return this.prisma.user.findMany();
  }

  @Get(':id')
  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  @Post('')
  async create(data: CreateUser) {
    return this.prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: data.password,
        apiKey: generateApiKey(),
      },
    });
  }

  @Post(':id')
  async update(id: string, data: CreateUser) {
    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        email: data.email,
        name: data.name,
        password: data.password,
      },
    });
  }

  @Delete(':id')
  async delete(id: string) {
    return this.prisma.user.delete({
      where: {
        id,
      },
    });
  }
}
