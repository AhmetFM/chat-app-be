import { ApiProperty } from '@nestjs/swagger';

export class UnauthorizedErrorResponse {
  @ApiProperty({
    description: 'Error message',
    example: 'Unauthorized',
  })
  message: string;

  @ApiProperty({
    description: 'HTTP status code',
    example: 401,
  })
  statusCode: number;
}
