import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import type { Prisma } from '@prisma/client';
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
  @ApiQuery({
    name: 'search',
    description: 'pencarian todo berdasarkan judul',
    required: false,
  })
  @ApiQuery({
    name: 'completed',
    description: 'pencarian todo berdasarkan status',
    required: false,
    type: Boolean,
  })
  async findAll(
    @Req() request,
    @Query('search') search?: string,
    @Query('completed') completed?: string,
  ) {
    let where: Prisma.TodoWhereInput = {};

    if (search) {
      where.title = {
        contains: search,
      };
    }

    if (completed) {
      where.completed = {
        equals: completed.toLowerCase() === 'true',
      };
    }

    if (request.apikey) {
      where.user = {
        apiKey: request.apikey,
      };
    }

    return this.prisma.todo.findMany({
      where,
    });
  }

  @Get(':id')
  @ApiOperation({
    summary: 'mengambil todo berdasarkan id',
  })
  async findOne(@Param('id') id: string, @Req() request) {
    let where: Prisma.TodoWhereUniqueInput = {
      id,
    };

    if (request.apikey) {
      where = {
        ...where,
        user: {
          apiKey: request.apikey,
        },
      };
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
      where,
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

  @Put(':id')
  @ApiOperation({
    summary: 'edit todo berdasarkan id',
  })
  async update(
    @Param('id') id: string,
    @Body() data: CreateTodo,
    @Req() request,
  ) {
    const apiKey = request.apikey;

    let where: Prisma.TodoWhereUniqueInput = {
      id,
    };

    if (request.apikey) {
      where = {
        ...where,
        user: {
          apiKey: request.apikey,
        },
      };
    }

    return this.prisma.todo.update({
      where,
      data,
    });
  }

  @Patch(':id/complete')
  @ApiOperation({
    summary: 'mengubah status menjadi complete todo berdasarkan id',
  })
  async complete(@Param('id') id: string, @Req() request) {
    const apiKey = request.apikey;
    let where: Prisma.TodoWhereUniqueInput = {
      id,
    };

    if (request.apikey) {
      where = {
        ...where,
        user: {
          apiKey: request.apikey,
        },
      };
    }
    return this.prisma.todo.update({
      where,
      data: {
        completed: true,
      },
    });
  }

  @Patch(':id/incomplete')
  @ApiOperation({
    summary: 'mengubah status menjadi incomplete todo berdasarkan id',
  })
  async incomplete(@Param('id') id: string, @Req() request) {
    const apiKey = request.apikey;
    let where: Prisma.TodoWhereUniqueInput = {
      id,
    };

    if (request.apikey) {
      where = {
        ...where,
        user: {
          apiKey: request.apikey,
        },
      };
    }
    return this.prisma.todo.update({
      where,
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
    let where: Prisma.TodoWhereUniqueInput = {
      id,
    };

    if (request.apikey) {
      where = {
        ...where,
        user: {
          apiKey: request.apikey,
        },
      };
    }

    return this.prisma.todo.delete({
      where,
    });
  }
}
