import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { CreateTodo } from './todos.dto';

@Controller('todos')
@ApiTags('todos')
@ApiBearerAuth('apikey')
export class TodosController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('')
  @ApiOperation({
    summary: 'mengambil semua todo',
  })
  async findAll(@Req() request) {
    return this.prisma.todo.findMany({
      where: {
        user: {
          apiKey: request.apikey,
        },
      },
    });
  }

  @Get(':id')
  @ApiOperation({
    summary: 'mengambil todo berdasarkan id',
  })
  async findOne(@Param('id') id: string, @Req() request) {
    const apiKey = request.apikey;
    if (apiKey) {
      return this.prisma.todo.findUnique({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        where: {
          id,
          user: {
            apiKey,
          },
        },
      });
    }

    return this.prisma.todo.findUnique({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      where: {
        id,
      },
    });
  }

  @Post('')
  @ApiOperation({
    summary: 'tambah todo baru',
  })
  async create(@Body() data: CreateTodo, @Req() request) {
    const apiKey = request.apikey;

    if (apiKey) {
      return this.prisma.todo.create({
        data: {
          ...data,
          userId: request.user.id,
        },
      });
    }

    return this.prisma.todo.create({
      data,
    });
  }

  @Post(':id')
  @ApiOperation({
    summary: 'edit todo berdasarkan id',
  })
  async update(
    @Param('id') id: string,
    @Body() data: CreateTodo,
    @Req() request,
  ) {
    const apiKey = request.apikey;

    return this.prisma.todo.update({
      where: {
        id,
        user: {
          apiKey,
        },
      },
      data,
    });
  }

  @Put(':id/complete')
  @ApiOperation({
    summary: 'mengubah status menjadi complete todo berdasarkan id',
  })
  async complete(@Param('id') id: string, @Req() request) {
    const apiKey = request.apikey;
    return this.prisma.todo.update({
      where: {
        id,
        user: {
          apiKey,
        },
      },
      data: {
        completed: true,
      },
    });
  }

  @Put(':id/incomplete')
  @ApiOperation({
    summary: 'mengubah status menjadi incomplete todo berdasarkan id',
  })
  async incomplete(@Param('id') id: string, @Req() request) {
    const apiKey = request.apikey;
    return this.prisma.todo.update({
      where: {
        id,
        user: {
          apiKey,
        },
      },
      data: {
        completed: false,
      },
    });
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'hapus todo berdasarkan id',
  })
  async delete(@Param('id') id: string, @Req() request) {
    const apiKey = request.apikey;
    return this.prisma.todo.delete({
      where: {
        id,
        user: {
          apiKey,
        },
      },
    });
  }
}
