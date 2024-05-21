import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { generateApiKey } from 'src/supports/str.support';
import { CreateUser } from './users.dto';

@Controller('users')
@ApiTags('users')
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
  async create(@Body() data: CreateUser) {
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
  async update(id: string, @Body() data: CreateUser) {
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
