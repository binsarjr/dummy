import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/services/prisma/prisma.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];

    if (apiKey) {
      const user = await this.prisma.user.findFirst({
        where: {
          apiKey,
        },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }
    }

    request['apikey'] = apiKey || undefined;
    return true;
  }
}
