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
    if (search)
      return this.prisma.post.findMany({
        where: {
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
        },
      });
    if (request.apikey)
      return this.prisma.post.findMany({
        where: {
          user: {
            apiKey: request.apikey,
          },
        },
      });

    return this.prisma.post.findMany();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'mengambil post berdasarkan id',
  })
  async findOne(@Req() request, @Param('id') id: string) {
    if (request.apikey)
      return this.prisma.post.findUnique({
        where: {
          id,
          user: {
            apiKey: request.apikey,
          },
        },
      });

    return this.prisma.post.findUnique({
      where: {
        id,
      },
    });
  }

  @Post('')
  @ApiOperation({
    summary: 'tambah post baru',
  })
  async create(@Req() request, @Body() data: CreatePost) {
    if (request.apikey)
      return this.prisma.post.create({
        data: {
          ...data,
          user: {
            connect: {
              apiKey: request.apikey,
            },
          },
        },
      });

    return this.prisma.post.create({
      data,
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
    if (request.apikey)
      return this.prisma.post.update({
        where: {
          id,
          user: {
            apiKey: request.apikey,
          },
        },
        data,
      });

    return this.prisma.post.update({
      where: {
        id,
      },
      data,
    });
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'hapus post berdasarkan id',
  })
  async delete(@Req() request, @Param('id') id: string) {
    if (request.apikey)
      return this.prisma.post.delete({
        where: {
          id,
          user: {
            apiKey: request.apikey,
          },
        },
      });

    return this.prisma.post.delete({
      where: {
        id,
      },
    });
  }
}
