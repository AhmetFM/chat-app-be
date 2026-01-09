import { ApiProperty } from '@nestjs/swagger';

export class LoginErrorResponse {
  @ApiProperty({
    description: 'Error message',
    example: 'Invalid credentials',
  })
  message: string;

  @ApiProperty({
    description: 'Error type',
    example: 'Unauthorized',
  })
  error: string;

  @ApiProperty({
    description: 'HTTP status code',
    example: 401,
  })
  statusCode: number;
}
