import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { CreateTodo } from './todos.dto';

@Controller('todos')
@ApiTags('todos')
@ApiBearerAuth('apikey')
export class TodosController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('')
  async findAll(@Req() request) {
    return this.prisma.todo.findMany({
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
        user: {
          apiKey: request.apikey,
        },
      },
    });
  }

  @Get(':id')
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
  async create(@Body() data: CreateTodo, @Req() request) {
    const apiKey = request.apikey;

    if (apiKey) {
      const user = await this.prisma.user.findUnique({
        where: {
          apiKey,
        },
      });

      if (!user) {
        throw new HttpException('User not found', 404);
      }

      return this.prisma.todo.create({
        data: {
          ...data,
          userId: user.id,
        },
      });
    }

    return this.prisma.todo.create({
      data,
    });
  }

  @Post(':id')
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
