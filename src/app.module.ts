import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from './config/config.module';
import { TodosModule } from './modules/todos/todos.module';
import { ApiKeyGuard } from './modules/users/strategy/apikey.guard';
import { UserModule } from './modules/users/users.module';

@Module({
  imports: [UserModule, ConfigModule, TodosModule],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ApiKeyGuard,
    },
  ],
})
export class AppModule {}
