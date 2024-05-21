import { Module } from '@nestjs/common';
import { UserController } from './users.controller';

@Module({
  providers: [],
  controllers: [UserController],
})
export class UserModule {}
