import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @ApiProperty({ description: 'Unique identifier', example: 'test@gmail.com' })
  email: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({
    description: 'Password must be at least 6 characters long',
    example: '123456',
  })
  password: string;

  @IsString()
  @ApiProperty({ description: 'Name of the user.', example: 'test' })
  name: string;
}
