import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEmail, IsOptional, IsString } from 'class-validator';

export class GetUserDto {
  @IsString()
  @ApiProperty({
    description: 'The id of the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @IsEmail()
  @ApiProperty({
    description: 'The email of the user',
    example: 'test@example.com',
  })
  email: string;

  @IsString()
  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
  })
  password: string;

  @IsString()
  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: 'The profile image of the user',
    example: 'https://example.com/profile.jpg',
    nullable: true,
  })
  @IsOptional()
  profileImage: string;

  @IsDate()
  @ApiProperty({
    description: 'The date the user was created',
    example: '2026-01-09T13:05:14.915Z',
  })
  createdAt: Date;

  @IsString()
  @ApiProperty({
    description: 'The about me section of the user',
    example: 'Available',
  })
  aboutMe: string;
}
