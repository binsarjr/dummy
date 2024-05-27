import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
import { CreatePost } from './posts.dto';

@Controller('posts')
@ApiTags('posts')
@ApiBearerAuth('apikey')
export class PostsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('')
  @ApiOperation({
    summary: 'mengambil semua post',
  })
  @ApiQuery({
    name: 'search',
    description: 'pencarian post berdasarkan judul atau content',
    required: false,
  })
  async findAll(@Req() request, @Query('search') search?: string) {
    let where: Prisma.PostWhereInput = {};

    if (search) {
      where = {
        ...where,
        OR: [
          {
            title: {
              contains: search,
            },
          },
          {
            content: {
              contains: search,
            },
          },
        ],
      };
    }

    if (request.apikey) {
      where = {
        ...where,
        user: {
          apiKey: request.apikey,
        },
      };
    }

    return this.prisma.post.findMany({
      where,
    });
  }

  @Get(':id')
  @ApiOperation({
    summary: 'mengambil post berdasarkan id',
  })
  async findOne(@Req() request, @Param('id') id: string) {
    let where: Prisma.PostWhereUniqueInput = {
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

    return this.prisma.post.findUnique({ where });
  }

  @Post('')
  @ApiOperation({
    summary: 'tambah post baru',
  })
  async create(@Req() request, @Body() data: CreatePost) {
    let createData: Prisma.PostCreateInput = {
      ...data,
    };

    if (request.apikey) {
      createData = {
        ...createData,
        user: {
          connect: {
            apiKey: request.apikey,
          },
        },
      };
    }

    return this.prisma.post.create({
      data: createData,
    });
  }

  @Put(':id')
  @ApiOperation({
    summary: 'edit post berdasarkan id',
  })
  async update(
    @Req() request,
    @Param('id') id: string,
    @Body() data: CreatePost,
  ) {
    let where: Prisma.PostWhereUniqueInput = {
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

    return this.prisma.post.update({
      where,
      data,
    });
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'hapus post berdasarkan id',
  })
  async delete(@Req() request, @Param('id') id: string) {
    let where: Prisma.PostWhereUniqueInput = {
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

    return this.prisma.post.delete({
      where,
    });
  }
}
