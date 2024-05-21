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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { CreatePost } from './posts.dto';

@Controller('posts')
@ApiTags('posts')
@ApiBearerAuth('apikey')
export class PostsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('')
  async findAll(@Req() request) {
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
