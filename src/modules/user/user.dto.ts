import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateUser {
  @ApiProperty()
  @IsString()
  name: string;
  @ApiProperty()
  @IsString()
  email: string;
  @ApiProperty()
  @IsString()
  password: string;
}
