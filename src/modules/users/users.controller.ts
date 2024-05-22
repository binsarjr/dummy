import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { generateApiKey } from 'src/supports/str.support';
import { CreateUser } from './users.dto';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('')
  @ApiOperation({
    summary: 'mengambil semua user',
  })
  async findAll() {
    return this.prisma.user.findMany();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'mengambil user berdasarkan id',
  })
  async findOne(@Param('id') id: string) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  @Post('')
  @ApiOperation({
    summary: 'tambah user baru',
  })
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
  @ApiOperation({
    summary: 'edit user berdasarkan id',
  })
  async update(@Param('id') id: string, @Body() data: CreateUser) {
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
  @ApiOperation({
    summary: 'hapus user berdasarkan id',
  })
  async delete(@Param('id') id: string) {
    return this.prisma.user.delete({
      where: {
        id,
      },
    });
  }
}
