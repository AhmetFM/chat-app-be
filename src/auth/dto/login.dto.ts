import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @ApiProperty({
    description: 'Email',
    example: 'test@test.com',
  })
  email: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({
    description: 'Password',
    example: '123456',
  })
  password: string;
}
