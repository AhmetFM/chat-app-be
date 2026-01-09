import { ApiProperty } from '@nestjs/swagger';

export class RegisterErrorResponse {
  @ApiProperty({
    description: 'Error message',
    example: 'Email already in use',
  })
  message: string;

  @ApiProperty({
    description: 'Error type',
    example: 'Bad Request',
  })
  error: string;

  @ApiProperty({
    description: 'HTTP status code',
    example: 400,
  })
  statusCode: number;
}
