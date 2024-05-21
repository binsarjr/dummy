import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { TodosModule } from './modules/todos/todos.module';
import { UserModule } from './modules/users/users.module';

@Module({
  imports: [UserModule, ConfigModule, TodosModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
